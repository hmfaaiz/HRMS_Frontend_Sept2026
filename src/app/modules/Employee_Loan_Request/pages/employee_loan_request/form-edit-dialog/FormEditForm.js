import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import {
  DatePickerField,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  amountLimit,
  formatDates,
  getDateDiffInDays,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import {
  fetchAllFormsMenu,
  fetchPayrollConfigApproverPermission,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { updateApprovedStatus, fetchEmployeeLoanRequest } from "../../../_redux/redux-Actions";

const EmployeeLoanRequestSchema = Yup.object().shape({
  loan_typeId: Yup.number().required(VALIDATION_MESSAGES.required),
  employee_loan_accountId: Yup.number().required(VALIDATION_MESSAGES.required),
  // applied_date: Yup.date().required(VALIDATION_MESSAGES.required),
  // installment_start_date: Yup.date().required(VALIDATION_MESSAGES.required),
  applied_date: Yup.date().required(VALIDATION_MESSAGES.required),
  installment_start_date: Yup.date()
    .min(
      Yup.ref("applied_date"),
      "Installment start date cannot be earlier than applied date"
    )
    .required(VALIDATION_MESSAGES.required),
  total_loan_amount: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),
  monthly_installment: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .required(VALIDATION_MESSAGES.required),
  reason: Yup.string().required(VALIDATION_MESSAGES.required),
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
  isEdit,
  isFileReq,
  setIsFileReq,
  disbaleLoading, formUIProps
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  const minDate = new Date(2024, 10, 6);
  useEffect(() => {
    if (!user.Id) {

      dispatch(actions.getAllLoanType());
      dispatch(fetchAllFormsMenu(45, "allAccountList", null, true));
      dispatch(fetchPayrollConfigApproverPermission("allPayrollConfigApproverPermissionList"))
    }
    //allPayrolGroupList
  }, [dispatch, user.Id]);
  const [changeLoanType, setChangeLoanType] = useState();
  const [maxAmountLimit, setMaxAmountLimit] = useState();
  const [maxMonthlyAmountSuggest, setMaxMonthlyAmountSuggest] = useState();
  const [monthlyInstallment, setMonthlyInstallments] = useState();
  const [totalInstallments, setTotalInstallments] = useState();
  const [totalLoanAmount, setTotalLoanAmount] = useState();
  const [dateOfJoining, setDateOfJoining] = useState();
  const [payrollMonth, setPayrollMonth] = useState();
  const [isClear, setIsClear] = useState(false);
  const [monthlyInstallmentsLimit, setMonthlyInstallmentsLimit] = useState();
  const [startDatePolicy, setStartDatePolicy] = useState();
  const [startDateLimit, setStartDateLimit] = useState();
  const [subsidiaryid, setSubsidiaryid] = useState();
  const [payrollConfigApproverPermission, setPayrollConfigApproverPermission] = useState(false);



  const { currentState, userAccess, auth } = useSelector((state) => {
    return {
      currentState: state.employee_loan_request,
      userAccess: state?.auth?.userAccess["employee_loan_request"],
      auth: state.auth.user
    };
  }, shallowEqual);

  const { loan_type, userForEdit } = currentState;

  useEffect(() => {
    setTotalLoanAmount(userForEdit?.total_loan_amount);
    setMonthlyInstallments(userForEdit?.monthly_installment);
    setChangeLoanType(userForEdit?.loan_typeId);
    setIsClear(false);
    checkPermission()
  }, [userForEdit]);

  useEffect(() => {
    if (changeLoanType) {

      setSubsidiaryid(currentState?.loan_config_details_permission?.loanDetails.subsidiaryId)
      let loandetails = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
        (item) => item.loan_typeId === changeLoanType
      );
      let employee = currentState?.loan_config_details_permission?.employee;
      let salary = currentState?.loan_config_details_permission?.salary;
      let payroll = currentState?.loan_config_details_permission?.payroll;
      let salaryAmount =
        loandetails?.basis == 0
          ? salary?.gross * loandetails?.salary_count
          : salary?.basic * loandetails?.salary_count;
      let monthlyInstallment;
      // let monthlySalarySuggest =
      //   loandetails?.installment_deduction_basis_type == 0
      //     ? (salary?.gross *
      //       parseFloat(
      //         currentState?.loan_config_details_permission?.loanDetails
      //           ?.installment_deduction_percentage
      //       )) /
      //     100
      //     : (salary?.basic *
      //       parseFloat(
      //         currentState?.loan_config_details_permission?.loanDetails
      //           ?.installment_deduction_percentage
      //       )) /
      //     100;
      let monthlySalarySuggest;

      if (currentState?.loan_config_details_permission?.loanDetails?.installment_deduction_basis_type == 1) {
        monthlySalarySuggest = (salary?.gross *
          parseFloat(
            currentState?.loan_config_details_permission?.loanDetails
              ?.installment_deduction_percentage
          )) / 100

      } else if (currentState?.loan_config_details_permission?.loanDetails?.installment_deduction_basis_type === 0) {
        monthlySalarySuggest = (salary?.basic *
          parseFloat(
            currentState?.loan_config_details_permission?.loanDetails
              ?.installment_deduction_percentage
          )) / 100;
      } else {
        monthlySalarySuggest = 0
      }

      if (loandetails?.max_no_of_installment_for_loan) {
        monthlyInstallment = loandetails?.max_no_of_installment_for_loan

      }

      setMonthlyInstallmentsLimit(monthlyInstallment)
      if (loandetails?.installment_start_date_policy) {
        setStartDatePolicy(loandetails?.installment_start_date_policy)

      }

      //  if(!isClear){

      if (loandetails?.basis == null) {

        setMaxAmountLimit(loandetails?.max_loan_amount);
      } else {

        setMaxAmountLimit(Math.min(loandetails?.max_loan_amount, salaryAmount));
      }


      setMaxMonthlyAmountSuggest(monthlySalarySuggest);
      //  }

      if (employee?.dateOfJoining) {
        const joiningDate = new Date(employee?.dateOfJoining);
        joiningDate.setHours(0, 0, 0, 0);
        setDateOfJoining(joiningDate); // Update state with the valid date
      }
      setPayrollMonth(null);
      if (payroll?.startDate) {

        const payrollDate = new Date(payroll?.startDate);
        payrollDate.setHours(0, 0, 0, 0);
        setPayrollMonth(payrollDate); // Update state with the valid date
      }
    } else {
      setMaxAmountLimit("");
      setMaxMonthlyAmountSuggest("");
      setTotalInstallments("");
      setMonthlyInstallmentsLimit("")
    }
  }, [changeLoanType, isEdit]);

  useEffect(() => {
    if (totalLoanAmount && monthlyInstallment) {
      const calculatedMonths = Math.ceil(totalLoanAmount / monthlyInstallment);
      setTotalInstallments(calculatedMonths);
    }
  }, [totalLoanAmount, monthlyInstallment, isEdit]);

  const filteredOptions = loan_type?.filter((option) =>
    currentState?.loan_config_details_permission?.loanDetails?.details?.some(
      (item) => item.loan_typeId === option.value
    )
  );

  const clearCustomeData = () => {
    setMaxAmountLimit("");
    setMaxMonthlyAmountSuggest("");
    setTotalInstallments("");
    setMonthlyInstallmentsLimit("")
  };

  const statusOptions = [
    { value: 0, label: "Inactive" },
    { value: 1, label: "Active" },
    { value: 2, label: "Pending" },
  ];

  const UpdateApprovedStatus = async (Id, approved_status) => {

    if (Id && approved_status) {
      let data = {
        Id, approved_status,

      }
      await dispatch(updateApprovedStatus(data, disbaleLoading, onHide));
      await dispatch(fetchEmployeeLoanRequest(formUIProps));
      setIds("");

    }

  }


  const addMonthsToDate = (dateStr, months) => {

    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);


    date.setHours(0, 0, 0, 0);



    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight (00:00:00)

    // Ensure the date is not in the past
    if (date < today) {
      // If the date is in the past, set it to today's date
      date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      date.setHours(0, 0, 0, 0); // Ensure time is reset to 00:00:00
    }


    setStartDateLimit(date);

    return date;
  };



  const checkPermission = () => {

    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      entity => entity.subsidiaryId === Number(userForEdit?.subsidiaryId)
    );


    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.roleId).trim();
      const loanApproverIds = permission?.loanApproverId?.map(id => String(id).trim());

      const isRoleLoanApprover = loanApproverIds?.includes(roleId);
      setPayrollConfigApproverPermission(isRoleLoanApprover);
     
    }
  }



  return (
    <Formik
      // key={user.Id || "new"}
      enableReinitialize={true}
      initialValues={user}
      validationSchema={EmployeeLoanRequestSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();
        //This clearForm function is created to clear form as well as clear any uploaded file as well.
        //resetForm function doesn't clear file properly so we use this function
        const clearForm = () => {
          resetForm();
          // if (totalLoanAmount) {
          //   setTotalLoanAmount(" ");
          //   // values.statusId=""
          // }
        };
        saveForm(
          values,
          totalInstallments,
          maxAmountLimit,
          setTotalInstallments,
          setMaxMonthlyAmountSuggest,
          setMaxAmountLimit,
          clearForm,
          monthlyInstallmentsLimit, setMonthlyInstallmentsLimit, subsidiaryid,
        );
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleReset,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                <div className="form-group row">
                  {/* <div className="col-12 col-md-12  p-0 m-0"> */}
                  <div className="col-12 col-md-6 ">
                    <SearchSelect
                      name="loan_typeId"
                      label={
                        <span>
                          Loan Type
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isEdit}
                      onChange={(e) => {
                        setFieldValue("loan_typeId", e.value || null);
                        setChangeLoanType(e.value);
                      }}
                      value={
                        loan_type?.find(
                          (option) => option.value === values.loan_typeId
                        ) || null
                      }
                      options={filteredOptions}
                      error={errors.loan_typeId}
                      touched={touched.loan_typeId}
                    />
                  </div>
                  {/* </div> */}

                  <div className="col-12 col-md-6">
                    <SearchSelect
                      name="employee_loan_accountId"
                      label={
                        <span>
                          Employee Loan Account
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue(
                          "employee_loan_accountId",
                          e.value || null
                        );
                      }}
                      value={
                        dashboard.allAccountList.find(
                          (option) =>
                            option.value === values.employee_loan_accountId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard.allAccountList.map((option) => ({
                        label: `${option.mergeLabel}`, // Adding the value to the label
                        value: option.value,
                      }))}
                      error={errors.employee_loan_accountId}
                      touched={touched.employee_loan_accountId}
                      isDisabled={userForEdit?.details[0]?.is_deducted}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Applied Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="applied_date"
                      component={DatePickerField}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue(
                          "applied_date",
                          e || null
                        );

                        addMonthsToDate(payrollMonth, startDatePolicy)

                      }}
                      minDate={dateOfJoining}
                      maxDate={new Date()}
                      disabled={userForEdit?.details[0]?.is_deducted || !values.loan_typeId}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Installment Start Date{""}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="installment_start_date"
                      component={DatePickerField}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Select Date"
                      type="date"
                      // maxDate={new Date()}
                      minDate={payrollMonth ? payrollMonth : undefined}
                      // minDate={values.applied_date ? values.applied_date : undefined}
                      // minDate={new Date(values.applied_date) < new Date() ? new Date() : values.applied_date}
                      maxDate={startDateLimit}
                      // disabled={!payrollMonth || userForEdit?.details[0]?.is_deducted || !values.loan_typeId || !values.applied_date}
                      disabled={userForEdit?.details[0]?.is_deducted || !values.loan_typeId || !values.applied_date || !payrollMonth}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="total_loan_amount"
                      component={Input}
                      placeholder="Enter total loan amount"
                      label={
                        <div className="d-flex">
                          <div className="d-flex">Total Loan Amount </div>
                          <div className="d-flex ml-3">
                            <span>
                              ( Amount Limit :
                              {maxAmountLimit?.toLocaleString() || 0})
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          </div>
                        </div>
                      }
                      type="number"
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (
                          maxAmountLimit !== undefined &&
                          value > maxAmountLimit
                        ) {
                          return; // Prevent setting value above max
                        }

                        setFieldValue("total_loan_amount", value);
                        setTotalLoanAmount(value);
                      }}
                      onInput={(e) => {
                        e.target.value = amountLimit(e.target.value); // Limit to 3 digits
                      }}
                      disabled={userForEdit?.details[0]?.is_deducted}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="monthly_installment"
                      component={Input}
                      placeholder="Enter monthly installment"
                      label={
                        <div className="d-flex">
                          <div className="d-flex"> Monthly Installment </div>
                          <div className="d-flex ml-3">
                            {maxMonthlyAmountSuggest ? (<span>
                              (Max Suggested Installment Based on Salary :{" "}
                              {maxMonthlyAmountSuggest?.toLocaleString() || 0})

                            </span>) : (null

                            )}
                            <span style={{ color: "red" }}>*</span>
                          </div>
                        </div>
                      }
                      type="number"
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (
                          totalLoanAmount !== undefined &&
                          value > totalLoanAmount
                        ) {
                          return; // Prevent setting value above max
                        }

                        setFieldValue("monthly_installment", value);
                        setMonthlyInstallments(value);
                      }}
                      onInput={(e) => {
                        e.target.value = amountLimit(e.target.value); // Limit to 3 digits
                      }}
                      disabled={userForEdit?.details[0]?.is_deducted}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="total_installment"
                      component={Input}
                      placeholder="Total installments"

                      label={
                        <div className="d-flex">
                          <div className="d-flex">    Total installments</div>
                          <div className="d-flex ml-3">
                            <span>
                              (Max installments :{" "}
                              {monthlyInstallmentsLimit?.toLocaleString() || 0})
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          </div>
                        </div>
                      }
                      type="number"
                      value={totalInstallments}
                      disabled={true}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="reason"
                      component={TextArea}
                      placeholder="Enter reason"
                      label={
                        <span>
                          Reason <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      disabled={userForEdit?.details[0]?.is_deducted}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="loan_amount_paid"
                      component={Input}
                      placeholder=""
                      label={<span>Loan Amount Paid</span>}
                      type="number"
                      // value={""}
                      disabled={true}
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="loan_amount_remaining"
                      component={Input}
                      placeholder=""
                      label={<span>Loan Amount Remaining</span>}
                      type="number"
                      // value={""}
                      // value={totalLoanAmount}
                      disabled={true}
                    />
                  </div>




                </div>
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / Ok Button */}
            {/* {!isUserForRead ? ( */}
            <button
              type="reset"
              onClick={() => {
                setIds("");

                clearCustomeData();

                handleReset();
              }}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
            {/* ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                Ok
              </button>
            )} */}

            {/* Save Button */}
            {!userForEdit?.details[0]?.is_deducted && (
              <>
                <button
                  type="submit"
                  // onClick={() => handleSubmit()}
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="btn btn-primary btn-elevate"
                  disabled={loading}
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}


                </button>
                

                {/* {
                  userForEdit?.approved_status === 2 ? (
                    <button
                      type="button"
                      className="btn btn-green"
                      onClick={() => UpdateApprovedStatus(user.Id, 1)}
                    >
                      Approve
                    </button>
                  ) : userForEdit?.approved_status === 1 ? (
                    <button
                      type="button"
                      className="btn btn-red"
                      onClick={() => UpdateApprovedStatus(user.Id, 2)}
                    >
                      Reject
                    </button>
                  ) : userForEdit ? <><button
                    type="button"
                    className="btn btn-green"
                    onClick={() => UpdateApprovedStatus(user.Id, 1)}
                  >
                    Approve
                  </button>
                    <button
                      type="button"
                      className="btn btn-red"
                      onClick={() => UpdateApprovedStatus(user.Id, 2)}
                    >
                      Reject
                    </button></> : null
                } */}

{payrollConfigApproverPermission && (
  userForEdit ? (
    userForEdit?.approved_status === 2 ? (
      <button
        type="button"
        className="btn btn-green"
        onClick={() => UpdateApprovedStatus(user.Id, 1)}
      >
        Approve
      </button>
    ) : userForEdit?.approved_status === 1 ? (
      <button
        type="button"
        className="btn btn-red"
        onClick={() => UpdateApprovedStatus(user.Id, 2)}
      >
        Reject
      </button>
    ) : (
      <>
        <button
          type="button"
          className="btn btn-green"
          onClick={() => UpdateApprovedStatus(user.Id, 1)}
        >
          Approve
        </button>
        <button
          type="button"
          className="btn btn-red"
          onClick={() => UpdateApprovedStatus(user.Id, 2)}
        >
          Reject
        </button>
      </>
    )
  ) : null
)}



              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
