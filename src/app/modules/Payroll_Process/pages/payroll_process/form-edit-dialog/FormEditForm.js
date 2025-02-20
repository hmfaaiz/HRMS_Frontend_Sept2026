
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllEmployeesWithNoPermissionData,
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
  fetchAllSubsidiaryData,
  fetchPayrollConfigApproverPermission,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getDateDiffInDays } from "../../../../../utils/common";
import * as actions from "../../../_redux/redux-Actions";
import { checkPayroll_EmployeesByIds, fetchPayrollProcess } from "../../../_redux/redux-Actions";
import { payroll_processSlice, callTypes } from "../../../_redux/redux-Slice";
// const { actions } = payroll_processSlice;
// percentage: Yup.string().required("Required*"),
const payroll_processEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  payroll_groupId: Yup.string()
    .nullable(),
  // .required(VALIDATION_MESSAGES.required),

  payroll_monthId: Yup.string()
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
  setIds, formUIProps, disbaleLoading
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [isAfterResult, setIsAfterResult] = useState(false)
  const [isStopSalModalOpen, setIsStopSalModalOpen] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedLoans, setSelectedLoans] = useState([]);
  const [payrollConfigApproverPermission, setPayrollConfigApproverPermission] = useState(false);


  const [isStopLoanModalOpen, setIsStopLoanModalOpen] = useState(false)
  const [selectedLoanEmployees, setSelectedLoanEmployees] = useState([]);
  useEffect(() => {
    if (!user.Id) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(127, "allPayrolGroupList"));
  dispatch(fetchPayrollConfigApproverPermission("allPayrollConfigApproverPermissionList"))


    }
  }, [dispatch, user.Id]);


  const { currentState, userAccess, auth } = useSelector((state) => {
    return {
      currentState: state.payroll_process,
      userAccess: state?.auth?.userAccess["payroll_process"],
      auth: state.auth.user
    };
  }, shallowEqual);

  const { userForEdit, checkPayroll_EmployeesExist, resultAfterPayrollProcess } = currentState;


  const payrollGroupDetails = async (subsidiaryId, payroll_groupId, payroll_monthId) => {

    if (subsidiaryId && payroll_monthId) {
      // Dispatch action to fetch payroll group details
      let body = {
        subsidiaryId,
        payroll_groupId, payroll_monthId
      };
      await dispatch(actions.fetchPayrollGroupDetails(body));
    }
  };



  const createPayrollStop_Salary = async (subsidiaryId, payroll_groupId, payroll_monthId, selectedEmployees) => {
    if (subsidiaryId && payroll_monthId) {
      // Dispatch action to fetch payroll group details
      let body = {
        subsidiaryId,
        payroll_groupId, payroll_monthId, selectedEmployees
      };
      await dispatch(actions.createPayrollStop_Salary(body, setSelectedEmployees, disbaleLoading, handleModalClose));
      payrollGroupDetails(subsidiaryId, payroll_groupId, payroll_monthId)
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
    const key = "allPayrollMonthYearList";  // The key parameter

    dispatch(fetchAllPayrollMonthYearList({ subsidiaryId: subsidiaryId, employeeId: null }, key));

  }

  const checkPayroll_Employees = async (setFieldValue, subsidiaryId, payroll_groupId, payroll_monthId, revert = false, finalize = false) => {


    if (subsidiaryId && payroll_monthId) {
      let data = {
        SubsidiaryId: subsidiaryId, PayrollGroupId: payroll_groupId, MonthId: payroll_monthId, revert, finalize,
      }

      await dispatch(checkPayroll_EmployeesByIds({ data }));
      if (revert) {
        await dispatch(fetchPayrollProcess(formUIProps));

      }


      // setIds("");

    }

  }

  const handleModalClose = () => {
    setIsStopSalModalOpen(false)
    setSelectedEmployees([])
  };
  const handleModalYes = () => {
    setIsStopSalModalOpen(true)
  };



  const handleLoanModalClose = () => {
    setIsStopLoanModalOpen(false)
    setSelectedLoanEmployees([])
  };
  const handleLoanModalYes = () => {

    setIsStopLoanModalOpen(true)
  };

  useEffect(() => {

    dispatch(fetchAllEmployeesWithNoPermissionData('allEmployeesWithNoPermissionList'));

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
      const exists = prev.some((item) => item.loan_request_detailId === data.loan_request_detailId);

      if (exists) {
        // Deselect the loan
        return prev.filter((item) => item.loan_request_detailId !== data.loan_request_detailId);
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
      currentState?.payroll_group_details?.stop_loan_employees_list);
  }, [currentState?.payroll_group_details]);

  const checkPermission = (subsidiaryId) => {

    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      entity => entity.subsidiaryId === Number(subsidiaryId)
    );


    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.roleId).trim();
      const payrollApproverIds = permission?.payrollApproverId?.map(id => String(id).trim());

      const isRolePayrollApprover = payrollApproverIds?.includes(roleId);
      setPayrollConfigApproverPermission(isRolePayrollApprover);

    }
  }

  return (
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
      {({ handleSubmit, errors, touched, values, handleReset, setFieldValue, handleChange }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            {isStopSalModalOpen && (
              <>
                <Modal show={isStopSalModalOpen} onHide={handleModalClose} style={{ zIndex: '99999' }}>
                  <Modal.Header closeButton>
                    <Modal.Title>Stop Salary</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>   <Form className="form form-label-right">
                    <fieldset disabled={isUserForRead}>


                      {/* allEmployeesWithNoPermissionList */}


                      <div className="from-group row">


                        <div className="col-12 col-md-12 mt-3">
                          Employee
                          <div style={{ backgroundColor: "#ffffff", height: "50vh", padding: "10px", overflow: "scroll" }}>

                            <div className="multi-select">
                              <div className="dropdown-label"></div>
                              <div className="dropdown-options" style={{ fontSize: "12px", fontWeight: "bold", padding: "5px" }}>
                                {currentState?.payroll_group_details?.employees_list?.map((option) => (
                                  <div key={option.Id} className="dropdown-option">
                                    <input style={{ width: "25px" }}
                                      name="employeeId"
                                      type="checkbox"
                                      value={option.Id}
                                      checked={selectedEmployees.includes(option.Id)}

                                      onChange={() => handleCheckboxChange(option.Id)}
                                    />
                                    {option.fullName}
                                  </div>
                                ))}
                                {/* {errors.employeeId && touched.employeeId && (
                                <div className="invalid-text">{errors.employeeId}</div>
                              )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>





                    </fieldset>
                  </Form></Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>No</Button>
                    {currentState?.payroll_group_details?.employees_list.length > 0 && (
                      <Button variant="primary" onClick={() => createPayrollStop_Salary(values.subsidiaryId, values.payroll_groupId, values.payroll_monthId, selectedEmployees)}>Yes</Button>
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

                        <div className="from-group row">
                          <div className="col-12 col-md-12 mt-3">
                            Employee
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                height: "50vh",
                                padding: "10px",
                                overflow: "scroll",
                              }}
                            >
                              <div className="multi-select">
                                <div className="dropdown-label"></div>
                                <div
                                  className="dropdown-options"
                                  style={{
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    padding: "5px",
                                  }}
                                >
                                  {currentState?.payroll_group_details?.for_loan_employees_list?.map(
                                    (option) => (
                                      <div
                                        key={option.Id}
                                        className="dropdown-option"
                                      >
                                        <input
                                          style={{ width: "25px" }}
                                          name="employeeId"
                                          type="checkbox"
                                          value={option.Id}
                                          // checked={selectedLoans.includes(
                                          //   option?.Id
                                          // )}

                                          checked={selectedLoans.some((item) => item.loan_request_detailId === option?.Id)}
                                          onChange={() =>
                                            handleLoanCheckboxChange({
                                              loan_request_detailId: option?.Id,
                                              employeeId: option?.employeeId,
                                              loan_typeId: option?.Employee_loan_request?.LoanType?.Id,
                                            })
                                          }
                                        />

                                        {`${option?.Employee_loan_request
                                          ?.Employee?.fullName || ""} - ${option
                                            ?.Employee_loan_request?.LoanType
                                            ?.name ||
                                          ""} (${option?.amount_received ||
                                          ""})`}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleLoanModalClose}>
                      No
                    </Button>
                    {currentState?.payroll_group_details?.for_loan_employees_list.length > 0 && (
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
                    )
                    }

                  </Modal.Footer>
                </Modal>
              </>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>

                <div className="form-group row">
                  <div className="col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-6 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          dispatch(actions.clearReduxData())
                          setFieldValue("subsidiaryId", e.value || null);
                          // payrollGroupDetails(e.value, values.payroll_groupId, values.payroll_monthId)
                          setFieldValue("payroll_monthId", null);
                          getPayroll(e.value)
                          checkPayroll_Employees(setFieldValue, e.value, values.payroll_groupId, values.payroll_monthId)
                          setIsAfterResult(false)
                          checkPermission(e.value)
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
                    </div>
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="payroll_groupId"
                      label={
                        <span>
                          Payroll Group<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("payroll_groupId", e.value || null);
                        payrollGroupDetails(values.subsidiaryId, e.value, values.payroll_monthId)
                        checkPayroll_Employees(setFieldValue, values.subsidiaryId, e.value, values.payroll_monthId)
                        setIsAfterResult(false)
                      }}


                      value={

                        values?.payroll_groupId == null
                          ? { value: null, label: 'All' }
                          : dashboard?.allPayrolGroupList?.find(
                            (option) => option.value === values.payroll_groupId
                          ) || null
                      }

                      // options={dashboard?.allPayrolGroupList}

                      options={[
                        { value: null, label: 'All' }, // Adding "All" option with value empty string
                        ...dashboard?.allPayrolGroupList, // Spread the rest of the menu options
                      ]}


                      error={errors.payroll_groupId}
                      touched={touched.payroll_groupId}
                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="payroll_monthId"
                      label={
                        <span>
                          Payroll Month<span style={{ color: "red" }}>*</span>
                        </span>
                      }

                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("payroll_monthId", e.value || null);
                        payrollGroupDetails(values.subsidiaryId, values.payroll_groupId, e.value)
                        checkPayroll_Employees(setFieldValue, values.subsidiaryId, values.payroll_groupId, e.value)
                        setIsAfterResult(false)
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


                  {currentState?.payroll_group_details && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleModalYes()}
                        className="m-3 btn btn-red"

                      >
                        Stop Salary
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>

                      <button
                        onClick={() => handleLoanModalYes()}
                        type="button"
                        className="m-3 btn btn-red"

                      >
                        Stop Loan
                        {loading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </>
                  )}

                  <div className='accordion-header-btn w-100  d-flex justify-content-left bg-primary m-4'>
                    <h6 className="text-white p-5">Before Process - Result</h6>
                  </div>
                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Total Employee:
                      <span style={{ fontWeight: 'bold' }}> {currentState?.payroll_group_details?.total_employees || 0}</span>
                    </label>

                  </div>

                  <div className="col-12 col-md-6 mt-3">

                    <label>
                      Salary setup created & approved: <span style={{ fontWeight: 'bold' }}> {currentState?.payroll_group_details?.slary_setup_not_created || 0}</span>
                    </label>

                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Loan to be processed: <span style={{ fontWeight: 'bold' }}>{currentState?.payroll_group_details?.loan_to_be_processed || 0}</span>
                    </label>

                  </div>


                  {/* <div className="col-12 col-md-6 mt-3">
                    <label>
                      Total Employee (Finalized): <span style={{ fontWeight: 'bold' }}>{0}</span>
                    </label>

                  </div> */}








                </div>


                {/* <hr /> */}

                {resultAfterPayrollProcess ?
                  <>
                    <div className='accordion-header-btn w-100  d-flex justify-content-left  bg-primary'>
                      <h6 className="text-white p-5">After Process - Result</h6>
                    </div>
                    <div className="form-group row">


                      <div className="col-12 col-md-6 mt-3">
                        <label>
                          Tax calculated: <span style={{ fontWeight: 'bold' }}>{resultAfterPayrollProcess?.TaxCalculated || 0}</span>
                        </label>

                      </div>

                      <div className="col-12 col-md-6 mt-3">
                        <label>
                          Tax not calculated: <span style={{ fontWeight: 'bold' }}>{resultAfterPayrollProcess?.TaxNotCalculated || 0}</span>
                        </label>

                      </div>


                      <div className="col-12 col-md-6 mt-3">
                        <label>
                          Employee with zero salary: <span style={{ fontWeight: 'bold' }}>{resultAfterPayrollProcess?.EmployeewithZeroSalary || 0}</span>
                        </label>

                      </div>
                      <div className="col-12 col-md-6 mt-3">
                        <label>
                          Employee with negative salary: <span style={{ fontWeight: 'bold' }}>{resultAfterPayrollProcess?.EmployeewithNegativeSalary || 0}</span>
                        </label>

                      </div>
                      <div className="col-12 col-md-6 mt-3">
                        <label>
                          Loan processed:<span style={{ fontWeight: 'bold' }}>{resultAfterPayrollProcess?.LoanProcess || 0}</span>
                        </label>

                      </div>

                    </div>

                  </>
                  : null


                }

              </fieldset>
            </Form>
          </Modal.Body>


          <Modal.Footer>
            {/* Cancel / Ok Button */}
            {/* checkPayroll_EmployeesExist */}

            {/* {checkPayroll_EmployeesExist?.length > 0 && ( */}

            <>
              {payrollConfigApproverPermission && (
                <>
                <button

                onClick={() => {
                  checkPayroll_Employees(setFieldValue, values.subsidiaryId, values.payroll_groupId, values.payroll_monthId, false, true);
                  setIds("");
                  handleReset();
                  dispatch(actions.clearReduxData())
                }}
                className="btn btn-green"
                disabled={loading || !checkPayroll_EmployeesExist?.finalize}
              >
                Finalize
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>



              <button

                onClick={() => {
                  checkPayroll_Employees(setFieldValue, values.subsidiaryId, values.payroll_groupId, values.payroll_monthId, true, false);
                  setIds("");
                  handleReset();
                  dispatch(actions.clearReduxData())
                }}
                className="btn btn-red"
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
                  dispatch(actions.clearReduxData())


                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                Ok
              </button>
            )}

            {/* Save Button */}
            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                  dispatch(actions.clearReduxData())
                  setIsAfterResult(true)
                }}
                className="btn btn-primary btn-elevate"
                disabled={loading || resultAfterPayrollProcess}
              >
                Execute
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}




          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
