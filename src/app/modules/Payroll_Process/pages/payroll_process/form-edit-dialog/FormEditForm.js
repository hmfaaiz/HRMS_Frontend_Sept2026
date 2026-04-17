import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
  fetchAllSubsidiaryData,
  fetchPayrollConfigApproverPermission,
  getAllPayrollAccount,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getDateDiffInDays, getUploadUrl } from "../../../../../utils/common";
import * as actions from "../../../_redux/redux-Actions";
import {
  checkPayroll_EmployeesByIds,
  fetchPayrollProcess,
} from "../../../_redux/redux-Actions";
import { payroll_processSlice, callTypes } from "../../../_redux/redux-Slice";
import { toast } from "react-toastify";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { NegativeSalaryEmpTable } from "../form-table/NegativeSalaryEmpTable";
import { View } from "lucide-react";
// const { actions } = payroll_processSlice;
// percentage: Yup.string().required("Required*"),
const payroll_processEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  payroll_groupId: Yup.string().nullable(),
  // .required(VALIDATION_MESSAGES.required),

  payroll_monthId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  payroll_accountId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  setIds,
  formUIProps,
  disbaleLoading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [isAfterResult, setIsAfterResult] = useState(false);
  const [isStopSalModalOpen, setIsStopSalModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [
    payrollConfigApproverPermission,
    setPayrollConfigApproverPermission,
  ] = useState(false);

  const [isStopLoanModalOpen, setIsStopLoanModalOpen] = useState(false);
  const [selectedLoanEmployees, setSelectedLoanEmployees] = useState([]);
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(127, "allPayrolGroupList"));
      dispatch(
        fetchPayrollConfigApproverPermission(
          "allPayrollConfigApproverPermissionList"
        )
      );
    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess, auth } = useSelector((state) => {
    return {
      currentState: state.payroll_process,
      userAccess: state?.auth?.userAccess["payroll_process"],
      auth: state.auth.user,
    };
  }, shallowEqual);

  const {
    userForEdit,
    checkPayroll_EmployeesExist,
    resultAfterPayrollProcess,
  } = currentState;

  
  useEffect(()=>{
   if(resultAfterPayrollProcess?.negSalaryEmp?.length > 0){
    setIsAfterResult(false);
    }
  },[resultAfterPayrollProcess?.negSalaryEmp?.length])

  const payrollGroupDetails = async (
    subsidiaryId,
    payroll_groupId,
    payroll_monthId
  ) => {
    if (subsidiaryId && payroll_monthId) {
      // Dispatch action to fetch payroll group details
      let body = {
        subsidiaryId,
        payroll_groupId,
        payroll_monthId,
      };
      await dispatch(actions.fetchPayrollGroupDetails(body));
    }
  };

  const createPayrollStop_Salary = async (
    subsidiaryId,
    payroll_groupId,
    payroll_monthId,
    selectedEmployees
  ) => {
    if (subsidiaryId && payroll_monthId) {
      // Dispatch action to fetch payroll group details
      let body = {
        subsidiaryId,
        payroll_groupId,
        payroll_monthId,
        selectedEmployees,
      };
      await dispatch(
        actions.createPayrollStop_Salary(
          body,
          setSelectedEmployees,
          disbaleLoading,
          handleModalClose
        )
      );
      payrollGroupDetails(subsidiaryId, payroll_groupId, payroll_monthId);
    }
  };

  const createPayrollStop_Loan = async (
    subsidiaryId,
    payroll_groupId,
    payroll_monthId,
    selectedLoans
  ) => {
    if (subsidiaryId && payroll_monthId) {
      // Dispatch action to fetch payroll group details
      let body = {
        subsidiaryId,
        payroll_groupId,
        payroll_monthId,
        selectedLoans,
      };
      await dispatch(
        actions.createPayrollStop_Loan(
          body,
          setSelectedLoans,
          disbaleLoading,
          handleLoanModalClose
        )
      );
      payrollGroupDetails(subsidiaryId, payroll_groupId, payroll_monthId);
    }
  };

  useEffect(() => {
    if (currentState?.payroll_group_details) {
    }
  }, [currentState?.payroll_group_details]);

  const getPayroll = (subsidiaryId) => {
    const key = "allPayrollMonthYearList"; // The key parameter

    dispatch(
      fetchAllPayrollMonthYearList(
        { subsidiaryId: subsidiaryId, employeeId: null },
        key
      )
    );
  };

  const checkPayroll_Employees = async (
    setFieldValue,
    subsidiaryId,
    payroll_groupId,
    payroll_monthId,
    revert = false,
    finalize = false
  ) => {
    if (subsidiaryId && payroll_monthId) {
      let data = {
        SubsidiaryId: subsidiaryId,
        PayrollGroupId: payroll_groupId,
        MonthId: payroll_monthId,
        revert,
        finalize,
      };

      await dispatch(checkPayroll_EmployeesByIds({ data }));
      if (revert) {
        await dispatch(fetchPayrollProcess(formUIProps));
      }

      // setIds("");
    }
  };

  const handleModalClose = () => {
    setIsStopSalModalOpen(false);
    setSelectedEmployees([]);
  };
  const handleModalYes = () => {
    setIsStopSalModalOpen(true);
  };

  const handleLoanModalClose = () => {
    setIsStopLoanModalOpen(false);
    setSelectedLoanEmployees([]);
  };
  const handleLoanModalYes = () => {
    setIsStopLoanModalOpen(true);
  };

  useEffect(() => {
    dispatch(
      fetchAllEmployeesWithNoPermissionData("allEmployeesWithNoPermissionList")
    );
  }, [dispatch]);

  const handleCheckboxChange = (value) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(value)) {
        // If the employee is already selected, remove it
        return prev.filter((id) => id !== value);
      } else {
        // If the employee is not selected, add it
        return [...prev, value];
      }
    });
  };

  const handleLoanCheckboxChange = (data) => {
    setSelectedLoans((prev) => {
      const exists = prev.some(
        (item) => item.loan_request_detailId === data.loan_request_detailId
      );

      if (exists) {
        // Deselect the loan
        return prev.filter(
          (item) => item.loan_request_detailId !== data.loan_request_detailId
        );
      } else {
        // Select the loan
        return [...prev, data];
      }
    });
  };

  useEffect(() => {
    setSelectedEmployees(
      currentState?.payroll_group_details?.stop_salary_employees_list?.map(
        (employee) => employee.employeeId
      )
    );
    setSelectedLoans(
      currentState?.payroll_group_details?.stop_loan_employees_list
    );
  }, [currentState?.payroll_group_details]);

  const checkPermission = (subsidiaryId) => {
    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      (entity) => entity.subsidiaryId === Number(subsidiaryId)
    );

    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.roleId).trim();
      const payrollApproverIds = permission?.payrollApproverId?.map((id) =>
        String(id).trim()
      );

      const isRolePayrollApprover = payrollApproverIds?.includes(roleId);
      setPayrollConfigApproverPermission(isRolePayrollApprover);
    }
  };

  const accountNotify = () => {
    toast("Account needs to be selected!");
  };

  return (
    <>
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={payroll_processEditSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();
        const clearForm = () => {
          resetForm();
        };
        saveForm(values, clearForm);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        handleReset,
        setFieldValue,
        handleChange,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            {isStopSalModalOpen && (
              <>
                <Modal
                  show={isStopSalModalOpen}
                  onHide={handleModalClose}
                  style={{ zIndex: "99999" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Stop Salary</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {" "}
                    <Form className="form form-label-right">
                      <fieldset disabled={isUserForRead}>
                        {/* allEmployeesWithNoPermissionList */}

                        <label> Employee </label>

                        <div className="overflow-auto max-h-48 border-none">
                          {currentState?.payroll_group_details?.employees_list?.map(
                            (option) => (
                              <div
                                key={option.Id}
                                className="flex justify-start items-center border-none"
                              >
                                <input
                                  className="mr-1"
                                  name="employeeId"
                                  type="checkbox"
                                  value={option.Id}
                                  checked={selectedEmployees.includes(
                                    option.Id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(option.Id)
                                  }
                                />
                                <label className="">{option?.employeeCode} - {option.fullName} </label>
                              </div>
                            )
                          )}
                          {/* {errors.employeeId && touched.employeeId && (
                                <div className="invalid-text">{errors.employeeId}</div>
                              )} */}
                        </div>
                      </fieldset>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                      No
                    </Button>
                    {currentState?.payroll_group_details?.employees_list
                      .length > 0 && (
                      <Button
                        variant="primary"
                        onClick={() =>
                          createPayrollStop_Salary(
                            values.subsidiaryId,
                            values.payroll_groupId,
                            values.payroll_monthId,
                            selectedEmployees
                          )
                        }
                      >
                        Yes
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>
              </>
            )}

            {isStopLoanModalOpen && (
              <>
                <Modal
                  show={isStopLoanModalOpen}
                  onHide={handleLoanModalClose}
                  style={{ zIndex: "99999" }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Stop Loan</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {" "}
                    <Form className="form form-label-right">
                      <fieldset disabled={isUserForRead}>
                        {/* allEmployeesWithNoPermissionList */}

                        <label>Employee</label>
                        <div className="overflow-auto max-h-48 border-none">
                          {currentState?.payroll_group_details?.for_loan_employees_list?.map(
                            (option) => (
                              <div
                                key={option.Id}
                                className="flex justify-start items-center border-none"
                              >
                                <input
                                  className="mr-1"
                                  name="employeeId"
                                  type="checkbox"
                                  value={option.Id}
                                  // checked={selectedLoans.includes(
                                  //   option?.Id
                                  // )}

                                  checked={selectedLoans.some(
                                    (item) =>
                                      item.loan_request_detailId === option?.Id
                                  )}
                                  onChange={() =>
                                    handleLoanCheckboxChange({
                                      loan_request_detailId: option?.Id,
                                      employeeId: option?.employeeId,
                                      loan_typeId:
                                        option?.Employee_loan_request?.LoanType
                                          ?.Id,
                                    })
                                  }
                                />
                                {console.log("option?.Employee_loan_request" , option?.Employee_loan_request)}
                                <label className="">
                                  {`${option?.Employee_loan_request?.Employee
                                    ?.employeeCode || ""} - ${option?.Employee_loan_request?.Employee
                                    ?.fullName || ""} - ${option
                                    ?.Employee_loan_request?.LoanType?.name ||
                                    ""} (${option?.amount_received || ""})`}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </fieldset>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleLoanModalClose}>
                      No
                    </Button>
                    {currentState?.payroll_group_details
                      ?.for_loan_employees_list.length > 0 && (
                      <Button
                        variant="primary"
                        onClick={() =>
                          createPayrollStop_Loan(
                            values.subsidiaryId,
                            values.payroll_groupId,
                            values.payroll_monthId,
                            selectedLoans
                          )
                        }
                      >
                        Yes
                      </Button>
                    )}
                  </Modal.Footer>
                </Modal>
              </>
            )}

            <PayrollCheckListModel data={formUIProps.payrollCheckListData} formUIProps={formUIProps} />
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="col-12 col-md-12 mt-3 d-flex flex-column align-items-end ">
                  <div className="d-flex flex-column align-items-start ">
                    {values?.subsidiaryId
                      ? (() => {
                          const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          );
                          return (
                            <>
                              {/* <div>
                            <b>Active Fiscal Year -</b>{" "}
                            {selectedSubsidiary?.fiscalYearLabel}
                          </div>
                          <div>
                            <b>Active Payroll Month -</b>{" "}
                            {selectedSubsidiary?.payrollMonthLabel}
                          </div> */}
                            </>
                          );
                        })()
                      : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-3 mt-2">
                  <div className="">
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        dispatch(actions.clearReduxData());
                        setFieldValue("subsidiaryId", e.value || null);
                        // payrollGroupDetails(e.value, values.payroll_groupId, values.payroll_monthId)
                        setFieldValue("payroll_monthId", null);
                        getPayroll(e.value);
                        checkPayroll_Employees(
                          setFieldValue,
                          e.value,
                          values.payroll_groupId,
                          values.payroll_monthId
                        );
                        setIsAfterResult(false);
                        checkPermission(e.value);
                        dispatch(getAllPayrollAccount(e.value));
                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (option) => option.value === values.subsidiaryId
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
                      // options={dashboard.allSubidiaryList.map(option => ({
                      //   label: `${option.label} (${option.value})`, // Adding the value to the label
                      //   value: option.value,
                      // }))}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                    {/* <SubsidiarySelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        dispatch(actions.clearReduxData());
                        setFieldValue("subsidiaryId", e.value || null);
                        // payrollGroupDetails(e.value, values.payroll_groupId, values.payroll_monthId)
                        setFieldValue("payroll_monthId", null);
                        getPayroll(e.value);
                        checkPayroll_Employees(
                          setFieldValue,
                          e.value,
                          values.payroll_groupId,
                          values.payroll_monthId
                        );
                        setIsAfterResult(false);
                        checkPermission(e.value);
                        dispatch(getAllPayrollAccount(e.value));
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {
                        dispatch(actions.clearReduxData());
                        setFieldValue("subsidiaryId", e.value || null);
                        // payrollGroupDetails(e.value, values.payroll_groupId, values.payroll_monthId)
                        setFieldValue("payroll_monthId", null);
                        getPayroll(e.value);
                        checkPayroll_Employees(
                          setFieldValue,
                          e.value,
                          values.payroll_groupId,
                          values.payroll_monthId
                        );
                        setIsAfterResult(false);
                        checkPermission(e.value);
                        dispatch(getAllPayrollAccount(e.value));
                      }}
                    /> */}
                  </div>

                  <div className="">
                    <SearchSelect
                      name="payroll_accountId"
                      label={
                        <span>
                          Account<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        setFieldValue("payroll_accountId", e.value || null);
                      }}
                      value={
                        dashboard?.allPayrollAccountList?.find(
                          (option) =>
                            Number(option.value) ===
                            Number(values.payroll_accountId)
                        ) ||
                        dashboard?.allPayrollAccountList?.find(
                          (option) =>
                            option.isDefault === true && values.subsidiaryId
                        ) ||
                        null
                      }
                      options={dashboard?.allPayrollAccountList || []}
                      error={errors.payroll_accountId}
                      touched={touched.payroll_accountId}
                    />
                  </div>

                  {/* Active payroll month */}

                  <div className="">
                    <SearchSelect
                      name="payroll_groupId"
                      label={
                        <span>
                          Payroll Group<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        setFieldValue("payroll_groupId", e.value || null);
                        payrollGroupDetails(
                          values.subsidiaryId,
                          e.value,
                          values.payroll_monthId
                        );
                        checkPayroll_Employees(
                          setFieldValue,
                          values.subsidiaryId,
                          e.value,
                          values.payroll_monthId
                        );
                        setIsAfterResult(false);
                      }}
                      value={
                        values?.payroll_groupId == null
                          ? { value: null, label: "All" }
                          : dashboard?.allPayrolGroupList?.find(
                              (option) =>
                                option.value === values.payroll_groupId
                            ) || null
                      }
                      // options={dashboard?.allPayrolGroupList}

                      options={[
                        { value: null, label: "All" }, // Adding "All" option with value empty string
                        ...dashboard?.allPayrolGroupList, // Spread the rest of the menu options
                      ]}
                      error={errors.payroll_groupId}
                      touched={touched.payroll_groupId}
                    />
                  </div>

                  <div className="">
                    <SearchSelect
                      name="payroll_monthId"
                      label={
                        <span>
                          Payroll Month<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || isAfterResult}
                      onChange={(e) => {
                        setFieldValue("payroll_monthId", e.value || null);
                        payrollGroupDetails(
                          values.subsidiaryId,
                          values.payroll_groupId,
                          e.value
                        );
                        checkPayroll_Employees(
                          setFieldValue,
                          values.subsidiaryId,
                          values.payroll_groupId,
                          e.value
                        );
                        setIsAfterResult(false);
                        if (!values.payroll_accountId) {
                          const defaultPayrollAccount = dashboard?.allPayrollAccountList?.find(
                            (option) => option.isDefault === true
                          );

                          setFieldValue(
                            "payroll_accountId",
                            defaultPayrollAccount?.value || null
                          );
                        }
                      }}
                      value={
                        dashboard?.allPayrollMonthYearList?.find(
                          (option) => option.value === values.payroll_monthId
                        ) || null
                      }
                      // options={dashboard?.allPayrollMonthYearList}
                      options={
                        dashboard?.allPayrollMonthYearList.filter(
                          (option) => option.isActive
                        ) || []
                      }
                      error={errors.payroll_monthId}
                      touched={touched.payroll_monthId}
                    />
                  </div>
                </div>

                <div className="form-group row">
                  {currentState?.payroll_group_details && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleModalYes()}
                        className="m-3 btn btn-red"
                        disabled={isAfterResult}
                      >
                        Stop Salary
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>

                      <button
                        onClick={() => handleLoanModalYes()}
                        type="button"
                        className="m-3 btn btn-danger"
                        disabled={isAfterResult}
                      >
                        Stop Loan
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </>
                  )}
                     {values.subsidiaryId &&
                        values.payroll_groupId && values.payroll_monthId ? <button
                        onClick={async () => {
                         let res = await dispatch(actions.fetchPayrollChecklistData({subsidiaryId : values.subsidiaryId , payrollGroupId : values.payroll_groupId}))
                         formUIProps.setPayrollCheckListData(res)
                        }}
                        type="button"
                        className="m-3 btn btn-primary"
                      >
                        View Payroll Checklist
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button> : null}
                </div>

                <div className="grid lg:grid-cols-2 gap-x-3 gap-y-1">
                  <div>
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Before Process - Result
                    </h6>

                    <div className="grid grid-cols-1 gap-x-3 col-span-12">
                      <div className="">
                        <label>
                          Total Employees (Active):
                          <span style={{ fontWeight: "bold" }}>
                            {" "}
                            {currentState?.payroll_group_details
                              ?.active_employee || 0}
                          </span>
                        </label>
                      </div>
                      <div className="">
                        <label>
                          Total Employees (Approved for Payroll):
                          <span style={{ fontWeight: "bold" }}>
                            {" "}
                            {currentState?.payroll_group_details
                              ?.total_employees || 0}
                          </span>
                        </label>
                      </div>

                      <div className="">
                        <label>
                          Salary setup created & approved:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {" "}
                            {currentState?.payroll_group_details
                              ?.slary_setup_not_created || 0}
                          </span>
                        </label>
                      </div>

                      <div className="">
                        <label>
                          Loan to be processed:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {currentState?.payroll_group_details
                              ?.loan_to_be_processed || 0}
                          </span>
                        </label>
                      </div>

                      <div className="">
                        <label>
                          Stop Salary:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {currentState?.payroll_group_details
                              ?.stop_salary_employees_list?.length || 0}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    {resultAfterPayrollProcess ? (
                      <>
                        <h6 className="font-bold mb-0 text-primary my-2 mt-3">
                          After Process - Result
                        </h6>
                        <div className="grid grid-cols-1 gap-x-3 col-span-12">
                          <div className="">
                            <label>
                              Tax calculated:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {resultAfterPayrollProcess?.TaxCalculated || 0}
                              </span>
                            </label>
                          </div>

                          <div className="">
                            <label>
                              Employee with zero salary:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {resultAfterPayrollProcess?.EmployeewithZeroSalary ||
                                  0}
                              </span>
                            </label>
                          </div>
                          <div className="">
                            <label>
                              Employee with negative salary:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {resultAfterPayrollProcess?.EmployeewithNegativeSalary ||
                                  0}
                              </span>
                            </label>
                          </div>
                          <div className="">
                            <label>
                              Loan processed:{" "}
                              <span style={{ fontWeight: "bold" }}>
                                {resultAfterPayrollProcess?.LoanProcess || 0}
                              </span>
                            </label>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* <hr /> */}
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / OK Button */}
            {/* checkPayroll_EmployeesExist */}

            {/* {checkPayroll_EmployeesExist?.length > 0 && ( */}

            <>
              {payrollConfigApproverPermission && (
                <>
                  <button
                    onClick={() => {
                      checkPayroll_Employees(
                        setFieldValue,
                        values.subsidiaryId,
                        values.payroll_groupId,
                        values.payroll_monthId,
                        false,
                        true
                      );
                      setIds("");
                      handleReset();
                      dispatch(actions.clearReduxData());
                    }}
                    className="btn btn-green"
                    // disabled={loading || (!resultAfterPayrollProcess && !checkPayroll_EmployeesExist?.finalize)}
                    disabled={
                      loading ||
                      (!checkPayroll_EmployeesExist?.finalize &&
                        !resultAfterPayrollProcess?.finalize)
                    }
                  >
                    Finalize
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      checkPayroll_Employees(
                        setFieldValue,
                        values.subsidiaryId,
                        values.payroll_groupId,
                        values.payroll_monthId,
                        true,
                        false
                      );
                      setIds("");
                      handleReset();
                      dispatch(actions.clearReduxData());
                    }}
                    className="btn btn-red"
                    // disabled={loading || (!resultAfterPayrollProcess && !checkPayroll_EmployeesExist?.revert)}
                    disabled={loading || !checkPayroll_EmployeesExist?.revert}
                  >
                    Revert
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </>
              )}
            </>
            {/* )} */}

            {!isUserForRead ? (
              <button
                type="reset"
                onClick={() => {
                  setIds("");
                  handleReset();
                  dispatch(actions.clearReduxData());

                  setIsAfterResult(false);
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                // onClick={onHide}

                onClick={() => {
                  onHide();
                  setIsAfterResult(false);
                }}
                className="btn btn-primary btn-elevate"
              >
                OK
              </button>
            )}

            {/* Save Button */}
            {/* {(!isUserForRead || !currentState?.payroll_group_details?.slary_setup_not_created>0 )&&( */}

            {/* { currentState?.payroll_group_details?.slary_setup_not_created > 0  && ( */}
            {
              <button
                type="submit"
                onClick={() => {
                  // if (!values.payroll_accountId) {

                  //   const defaultPayrollAccount = dashboard?.allPayrollAccountList?.find(
                  //     (option) => option.isDefault === true
                  //   );

                  //   setFieldValue("payroll_accountId", defaultPayrollAccount?.value || null);

                  // }
                  handleSubmit();

                  // dispatch(actions.clearReduxData())
                  setIsAfterResult(true);
                }}
                className="btn btn-primary btn-elevate"
                disabled={
                  loading ||
                  resultAfterPayrollProcess?.negSalaryEmp?.length == 0 ||
                  !currentState?.payroll_group_details
                    ?.slary_setup_not_created > 0 
                    || !checkPayroll_EmployeesExist?.execute
                }
              >
                Execute
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            }
            {/* )} */}
          </Modal.Footer>
          <NegativeSalaryEmpTable monthId={values.payroll_monthId} monthLabel={dashboard?.allPayrollMonthYearList?.find((e)=> e?.value == values.payroll_monthId)?.label} />
        </>
      )}
    </Formik>
    </>
  );
}



const PayrollCheckListModel = ({ data, formUIProps }) => {

  const handleClose = () => {
    formUIProps.setPayrollCheckListData(null);
  };

  // Check if data is empty
  const isEmpty = !data || data.length === 0;

  // Get unique subsidiary and payroll group from first item (assuming same for all)
  const subsidiaryName = data?.[0]?.SubsidiaryDetail?.name || "";
  const payrollGroupName = data?.[0]?.PayrollGroup?.formName || "";

  return (
    <Modal
      show={!!data && data.length > 0}
      onHide={handleClose}
      style={{ zIndex: "99999" }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Payroll Checklist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEmpty ? (
          <div className="text-center py-5">
            <h5 className="text-muted">No checklist found</h5>
          </div>
        ) : (
          <>
            {/* Subsidiary and Payroll Group Info */}
            <div className="mb-2 ">
              <div className="row">
                <div className="col-md-6">
                  <strong>Subsidiary:</strong> {subsidiaryName}
                </div>
                <div className="col-md-6">
                  <strong>Payroll Group:</strong> {payrollGroupName}
                </div>
              </div>
            </div>

            {/* Table Design */}
            <div className="w-full overflow-x-auto">
              <div className="react-bootstrap-table table-responsive">
                <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                  <thead>
                    <tr className="custom-table-header">
                      <th>#</th>
                      <th>Checklist Category</th>
                      <th>Task Name</th>
                      <th>Task Description</th>
                      <th>Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={row.Id || index}>
                        <td>{index + 1}</td>
                        <td>{row?.ChecklistCategory?.formName || "-"}</td>
                        <td>{row?.taskName || "-"}</td>
                        <td>{row?.taskDescription || "-"}</td>
                        <td>
                          {row?.attachmentPath ? (
                            <a
                              href={getUploadUrl(row?.attachmentPath)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <View className="w-4 h-4 text-black cursor-pointer" />
                            </a>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};