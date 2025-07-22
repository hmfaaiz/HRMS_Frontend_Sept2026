import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { format, parse } from "date-fns";
import CustomFormLoanDialog from "./CustomFormLoanDialog";
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
  getDateDiffInMonths,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import {
  fetchAllFormsMenu,
  fetchPayrollConfigApproverPermission,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  updateApprovedStatus,
  fetchEmployeeLoanRequest,
} from "../../../_redux/redux-Actions";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

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
  disbaleLoading,
  formUIProps,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  const minDate = new Date(2024, 10, 6);
  useEffect(() => {
    if (!user.Id) {
      dispatch(actions.getAllLoanType());
      dispatch(fetchAllFormsMenu(45, "allAccountList", null, true));
      dispatch(
        fetchPayrollConfigApproverPermission(
          "allPayrollConfigApproverPermissionList"
        )
      );
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
  const [
    payrollConfigApproverPermission,
    setPayrollConfigApproverPermission,
  ] = useState(false);

  const { currentState, userAccess, auth, entities } = useSelector((state) => {
    return {
      currentState: state.employee_loan_request,
      userAccess: state?.auth?.userAccess["employee_loan_request"],
      auth: state.auth.user,
      entities: state?.employee_loan_request?.entities,
    };
  }, shallowEqual);

  const { loan_type, userForEdit } = currentState;

  //set the values limit
  useEffect(() => {
    setTotalLoanAmount(userForEdit?.total_loan_amount);
    setMonthlyInstallments(userForEdit?.monthly_installment);
    setChangeLoanType(userForEdit?.loan_typeId);
    setIsClear(false);
    checkPermission();
  }, [userForEdit]);

  const policyLoadByLoanType = (changeLoanType) => {
    if (changeLoanType) {
      setSubsidiaryid(
        currentState?.loan_config_details_permission?.loanDetails.subsidiaryId
      );
      let loandetails = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
        (item) => item.loan_typeId === changeLoanType
      );
      let employee = currentState?.loan_config_details_permission?.employee;
      let salary = currentState?.loan_config_details_permission?.salary;
      let payroll = currentState?.loan_config_details_permission?.payroll;

      //slalry type limit according to loan salry policy
      let salaryAmount =
        loandetails?.basis == 0
          ? salary?.gross * loandetails?.salary_count
          : salary?.basic * loandetails?.salary_count;
      let monthlyInstallment;

      let monthlySalarySuggest;

      //calculation for monthly amount suggestion limit by installment deduction basis type
      if (
        currentState?.loan_config_details_permission?.loanDetails
          ?.installment_deduction_basis_type == 1
      ) {
        monthlySalarySuggest =
          (salary?.gross *
            parseFloat(
              currentState?.loan_config_details_permission?.loanDetails
                ?.installment_deduction_percentage
            )) /
          100;
      } else if (
        currentState?.loan_config_details_permission?.loanDetails
          ?.installment_deduction_basis_type === 0
      ) {
        monthlySalarySuggest =
          (salary?.basic *
            parseFloat(
              currentState?.loan_config_details_permission?.loanDetails
                ?.installment_deduction_percentage
            )) /
          100;
      } else {
        monthlySalarySuggest = 0;
      }

      //no. of installments
      if (loandetails?.max_no_of_installment_for_loan) {
        monthlyInstallment = loandetails?.max_no_of_installment_for_loan;
      }

      setMonthlyInstallmentsLimit(monthlyInstallment);

      //start date policy for loan deduction
      if (loandetails?.installment_start_date_policy) {
        setStartDatePolicy(loandetails?.installment_start_date_policy);
      }

      //if already loan taken ,running balanace
      const currentLoan = entities.filter(
        (item) => item?.loan_typeId === changeLoanType
      );

      let runningBalance = 0;
      currentLoan.forEach((loan) => {
        loan.details.forEach((detail) => {
          // Add the payment amount from the running balance

          if (!detail?.is_deducted) {
            runningBalance += detail.amount_received;
          }
        });
      });

      //max loan amount
      if (loandetails?.basis == null) {
        setMaxAmountLimit(loandetails?.max_loan_amount - runningBalance);
      } else {
        // set min value salary or loan limit

        setMaxAmountLimit(
          Math.min(loandetails?.max_loan_amount, salaryAmount) - runningBalance
        );
      }

      setMaxMonthlyAmountSuggest(monthlySalarySuggest);

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
      setMonthlyInstallmentsLimit("");
    }
  };

  useEffect(() => {
    policyLoadByLoanType(changeLoanType);
  }, [changeLoanType, isEdit]);

  // useEffect(() => {

  //   if (changeLoanType) {

  //     setSubsidiaryid(currentState?.loan_config_details_permission?.loanDetails.subsidiaryId)
  //     let loandetails = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
  //       (item) => item.loan_typeId === changeLoanType
  //     );
  //     let employee = currentState?.loan_config_details_permission?.employee;
  //     let salary = currentState?.loan_config_details_permission?.salary;
  //     let payroll = currentState?.loan_config_details_permission?.payroll;

  //     //slalry type limit according to loan salry policy
  //     let salaryAmount =
  //       loandetails?.basis == 0
  //         ? salary?.gross * loandetails?.salary_count
  //         : salary?.basic * loandetails?.salary_count;
  //     let monthlyInstallment;

  //     let monthlySalarySuggest;

  //     //calculation for monthly amount suggestion limit by installment deduction basis type
  //     if (currentState?.loan_config_details_permission?.loanDetails?.installment_deduction_basis_type == 1) {
  //       monthlySalarySuggest = (salary?.gross *
  //         parseFloat(
  //           currentState?.loan_config_details_permission?.loanDetails
  //             ?.installment_deduction_percentage
  //         )) / 100

  //     } else if (currentState?.loan_config_details_permission?.loanDetails?.installment_deduction_basis_type === 0) {
  //       monthlySalarySuggest = (salary?.basic *
  //         parseFloat(
  //           currentState?.loan_config_details_permission?.loanDetails
  //             ?.installment_deduction_percentage
  //         )) / 100;
  //     } else {
  //       monthlySalarySuggest = 0
  //     }

  //     //no. of installments
  //     if (loandetails?.max_no_of_installment_for_loan) {
  //       monthlyInstallment = loandetails?.max_no_of_installment_for_loan

  //     }

  //     setMonthlyInstallmentsLimit(monthlyInstallment)

  //     //start date policy for loan deduction
  //     if (loandetails?.installment_start_date_policy) {
  //       setStartDatePolicy(loandetails?.installment_start_date_policy)

  //     }

  //     //if already loan taken ,running balanace
  //     const currentLoan = entities.filter(item => item?.loan_typeId === changeLoanType && item.isLoanContinuing);

  //     let runningBalance = 0
  //     currentLoan.forEach(loan => {

  //       loan.details.forEach(detail => {
  //         // Add the payment amount from the running balance

  //         if(!detail?.is_deducted){

  //           runningBalance += detail.amount_received;
  //         }

  //       });
  //     });

  //     //max loan amount
  //     if (loandetails?.basis == null) {

  //       setMaxAmountLimit(loandetails?.max_loan_amount - runningBalance);
  //     } else {
  //       // set min value salary or loan limit

  //       setMaxAmountLimit(Math.min(loandetails?.max_loan_amount, salaryAmount) - runningBalance);
  //     }

  //     setMaxMonthlyAmountSuggest(monthlySalarySuggest);

  //     if (employee?.dateOfJoining) {
  //       const joiningDate = new Date(employee?.dateOfJoining);
  //       joiningDate.setHours(0, 0, 0, 0);
  //       setDateOfJoining(joiningDate); // Update state with the valid date
  //     }
  //     setPayrollMonth(null);
  //     if (payroll?.startDate) {

  //       const payrollDate = new Date(payroll?.startDate);
  //       payrollDate.setHours(0, 0, 0, 0);
  //       setPayrollMonth(payrollDate); // Update state with the valid date
  //     }
  //   } else {
  //     setMaxAmountLimit("");
  //     setMaxMonthlyAmountSuggest("");
  //     setTotalInstallments("");
  //     setMonthlyInstallmentsLimit("")
  //   }
  // }, [changeLoanType, isEdit]);

  useEffect(() => {
    if (totalLoanAmount && monthlyInstallment) {
      const calculatedMonths = Math.ceil(totalLoanAmount / monthlyInstallment);
      setTotalInstallments(calculatedMonths);
    }
  }, [totalLoanAmount, monthlyInstallment, isEdit]);

  // const filteredOptions = loan_type?.filter((option) =>
  //   currentState?.loan_config_details_permission?.loanDetails?.details?.some(
  //     (item) => item.loan_typeId === option.value
  //   )
  // );

  // Function to get the last payroll month
  const getLastPayrollMonth = (loanDeductionDate) => {
    // Get the payroll month dates from the account details
    const payrollDates = loanDeductionDate.map(
      (detail) => new Date(detail.payroll_month_date)
    );

    // Sort the payroll dates in descending order and get the most recent one
    const latestDate = payrollDates.sort((a, b) => b - a)[0];

    // Return the most recent payroll date as a string
    return latestDate?.toLocaleDateString("en-GB"); // Format it as 'dd/mm/yyyy'
  };

  const formatDateString = (dateString) => {
    const [month, day, year] = dateString.split("/");
    const paddedMonth = month.padStart(2, "0");
    const paddedDay = day.padStart(2, "0");
    return `${paddedMonth}/${paddedDay}/${year}`;
  };

  const filteredOptions = loan_type?.map((option) => {
    //check eleigibility according to joining
    let currentDropDownLoan = currentState?.loan_config_details_permission?.loanDetails?.details?.find(
      (item) => item?.loan_typeId === option?.value
    );

    let eligibilityMonth;

    const today = new Date();
    const dateOfJoining = new Date(
      currentState?.loan_config_details_permission?.employee?.dateOfJoining
    );

    if (
      currentDropDownLoan?.eligibilityPolicy <=
      getDateDiffInMonths(dateOfJoining, today)
    ) {
      eligibilityMonth = true;
    }

    //if multiple loans are not allowed
    if (
      !currentDropDownLoan?.isAllowMultipleLoans &&
      entities?.some(
        (item) => item?.loan_typeId === option?.value && item.isLoanContinuing
      )
    ) {
      eligibilityMonth = false;
    }

    //if loan completed then how many months are  required to take it again
    if (currentDropDownLoan?.monthsToApplyForNewLoan > 0) {
      const matchingEntities = entities.filter(
        (item) => item?.loan_typeId === option?.value && !item.isLoanContinuing
      );
      let monthsRequiredForLoan = false;
      if (matchingEntities.length > 0) {
        matchingEntities.forEach((entity) => {
          const lastLoanDeduction = getLastPayrollMonth(entity?.details);

          if (lastLoanDeduction) {
            const formattedDateString = formatDateString(lastLoanDeduction);
            const lastLoanDeductionDate = parse(
              formattedDateString,
              "dd/MM/yyyy",
              new Date()
            );
            if (
              currentDropDownLoan?.monthsToApplyForNewLoan <=
              getDateDiffInMonths(new Date(lastLoanDeductionDate), today)
            ) {
              eligibilityMonth = true;
            } else {
              monthsRequiredForLoan = true;
              eligibilityMonth = false;
            }
          }
        });
      }

      const matchingCurrentLoans = entities.filter(
        (item) => item?.loan_typeId === option?.value && item.isLoanContinuing
      );
      if (matchingCurrentLoans.length > 0) {
        eligibilityMonth = false;
      }

      if (monthsRequiredForLoan) {
        eligibilityMonth = false;
      }
    }
    const isDisabled = !eligibilityMonth; // Disable option if not eligible or not in filteredOptions

    return {
      ...option, // Spread the existing option properties
      isDisabled: isDisabled, // Add disabled flag
    };
  });

  const isLoanCompleted = () => {};

  const clearCustomeData = () => {
    setMaxAmountLimit("");
    setMaxMonthlyAmountSuggest("");
    setTotalInstallments("");
    setMonthlyInstallmentsLimit("");
  };

  useEffect(() => {
    clearCustomeData();
  }, [currentState]);
  const statusOptions = [
    { value: 0, label: "Inactive" },
    { value: 1, label: "Active" },
    { value: 2, label: "Pending" },
  ];

  //update status
  const UpdateApprovedStatus = async (Id, approved_status) => {
    if (Id && approved_status) {
      let data = {
        Id,
        approved_status,
      };
      await dispatch(updateApprovedStatus(data, disbaleLoading, onHide));

      await dispatch(fetchEmployeeLoanRequest(formUIProps));
      setIds("");
    }
  };

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

  //approval permission
  const checkPermission = () => {
    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      (entity) => entity.subsidiaryId === Number(userForEdit?.subsidiaryId)
    );

    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      const roleId = String(auth?.roleId).trim();
      const loanApproverIds = permission?.loanApproverId?.map((id) =>
        String(id).trim()
      );

      const isRoleLoanApprover = loanApproverIds?.includes(roleId);
      setPayrollConfigApproverPermission(isRoleLoanApprover);
    }
  };

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleCheckboxClick = () => {
    isLoanCompleted();
    setShowModal(true); // Open the modal when checkbox is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };

  const { activeFiscalYear } = useSelector((state) => state.dashboard);

  return (
    <Formik
      // key={user.Id || "new"}
      enableReinitialize={true}
      initialValues={user}
      validationSchema={EmployeeLoanRequestSchema}
      onSubmit={(values, { resetForm }) => {
        enableLoading();

        const clearForm = () => {
          resetForm();
        };
        saveForm(
          values,
          totalInstallments,
          maxAmountLimit,
          setTotalInstallments,
          setMaxMonthlyAmountSuggest,
          setMaxAmountLimit,
          clearForm,
          monthlyInstallmentsLimit,
          setMonthlyInstallmentsLimit,
          subsidiaryid
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
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset
                disabled={
                  isUserForRead || !currentState?.loan_config_details_permission
                }
              >
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
                      isDisabled={
                        isUserForRead ||
                        !currentState?.loan_config_details_permission
                      }
                      onChange={(e) => {
                        setFieldValue("loan_typeId", e.value || null);
                        setChangeLoanType(e.value);
                        policyLoadByLoanType(e.value);
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

                  {/* Active payroll month */}

                  {/* <div className="col-12 col-md-6 mt-3 d-flex flex-column align-items-end">
                    {activeFiscalYear
                      ? (() => {
                          return (
                            <>
                              <div>
                                <b>Active Fiscal Year -</b>{" "}
                                {activeFiscalYear?.label}
                              </div>
                              <div>
                                <b>Active Payroll Month -</b>{" "}
                                {activeFiscalYear?.payrollMonthLabel}
                              </div>
                            </>
                          );
                        })()
                      : null}
                  </div> */}

                  <div className="col-12 col-md-6 ">
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
                      isDisabled={
                        userForEdit ||
                        userForEdit?.details[0]?.is_deducted ||
                        !currentState?.loan_config_details_permission
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Applied Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="applied_date"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("applied_date", e || null);

                        addMonthsToDate(payrollMonth, startDatePolicy);
                      }}
                      minDate={dateOfJoining}
                      maxDate={new Date()}
                      disabled={
                        userForEdit ||
                        userForEdit?.details[0]?.is_deducted ||
                        !values.loan_typeId
                      }
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
                      dateFormat="dd-MMM-yyyy"
                      placeholder="Select Date"
                      type="date"
                      // maxDate={new Date()}
                      minDate={payrollMonth ? payrollMonth : undefined}
                      // minDate={values.applied_date ? values.applied_date : undefined}
                      // minDate={new Date(values.applied_date) < new Date() ? new Date() : values.applied_date}
                      maxDate={startDateLimit}
                      // disabled={!payrollMonth || userForEdit?.details[0]?.is_deducted || !values.loan_typeId || !values.applied_date}
                      disabled={
                        userForEdit ||
                        userForEdit?.details[0]?.is_deducted ||
                        !values.loan_typeId ||
                        !values.applied_date ||
                        !payrollMonth
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    {/* <Field
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
                      // disabled={userForEdit?.details[0]?.is_deducted}
                      disabled={userForEdit}
                    /> */}
                    <AmountInput
                      field={{
                        name: `total_loan_amount`,
                        value: values?.total_loan_amount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      onChange={(e) => {
                        const value = Number(e);
                        if (
                          maxAmountLimit !== undefined &&
                          value > maxAmountLimit
                        ) {
                          return; // Prevent setting value above max
                        }
                        // setFieldValue("total_loan_amount", value);
                        setTotalLoanAmount(value);
                      }}
                      disabled={userForEdit}
                      max={maxAmountLimit}
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
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <AmountInput
                      field={{
                        name: `monthly_installment`,
                        value: values?.monthly_installment,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      max={maxAmountLimit}
                      onChange={(e) => {
                        const value = Number(e);
                        if (
                          totalLoanAmount !== undefined &&
                          value > totalLoanAmount
                        ) {
                          return; // Prevent setting value above max
                        }
                        // setFieldValue("monthly_installment", value);
                        setMonthlyInstallments(value);
                      }}
                      disabled={userForEdit}
                      placeholder="Enter monthly installment"
                      label={
                        <div className="d-flex">
                          <div className="d-flex"> Monthly Installment</div>
                          <div className="d-flex ml-3">
                            {maxMonthlyAmountSuggest ? (
                              <span>
                                (Max Suggested Installment Based on Salary :{" "}
                                {maxMonthlyAmountSuggest?.toLocaleString() || 0}
                                )
                              </span>
                            ) : null}
                            <span style={{ color: "red" }}>*</span>
                          </div>
                        </div>
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="total_installment"
                      component={Input}
                      placeholder="Total installments"
                      label={
                        <div className="d-flex">
                          <div className="d-flex"> Total installments</div>
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
                      disabled={
                        userForEdit || userForEdit?.details[0]?.is_deducted
                      }
                    />
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                  <AmountInput
                      field={{
                        name: `loan_amount_paid`,
                        value: values?.loan_amount_paid,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      label={<span>Loan Amount Paid</span>}
                      disabled={true}
                    />
                    {/* <Field
                      name="loan_amount_paid"
                      component={Input}
                      placeholder=""
                      label={<span>Loan Amount Paid</span>}
                      disabled={true}
                      type="number"
                      // value={""}
                    /> */}
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                  <AmountInput
                      field={{
                        name: `loan_amount_remaining`,
                        value: values?.loan_amount_remaining,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      label={<span>Loan Amount Remaining</span>}
                      disabled={true}
                    />
                    {/* <Field
                      name="loan_amount_remaining"
                      component={Input}
                      placeholder=""
                      label={<span>Loan Amount Remaining</span>}
                      type="number"
                      // value={""}
                      // value={totalLoanAmount}
                      disabled={true}
                    /> */}
                  </div>

                  <div className="col-12 col-md-6 mt-3">
                    {/* Your Field component (Checkbox) */}
                    <Field
                      name="isLoanContinuing"
                      component="input"
                      type="checkbox"
                      id="isLoanContinuing"
                      checked={!values.isLoanContinuing && userForEdit}
                      onClick={handleCheckboxClick} // Trigger modal on checkbox click
                      disabled={!userForEdit || !userForEdit?.isLoanContinuing}
                    />
                    <label className="ml-2 mb-2" htmlFor="isLoanContinuing">
                      Loan Completed
                    </label>

                    {/* CustomFormLoanDialog component is rendered here and controlled by the state */}

                    <CustomFormLoanDialog
                      showModal={showModal}
                      handleClose={handleCloseModal}
                      userForEdit={userForEdit}
                      message={
                        userForEdit && userForEdit.loan_amount_remaining == 0
                          ? "Are you sure to close this loan?"
                          : "Are you sure to close this loan, this loan is not completed?"
                      }
                      handleReset={handleReset}
                      setIds={setIds}
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
                  disabled={userForEdit || loading}
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>

                {payrollConfigApproverPermission &&
                  (userForEdit ? (
                    userForEdit?.approved_status === 2 ? (
                      <button
                        type="button"
                        className="btn btn-green"
                        onClick={() => UpdateApprovedStatus(user.Id, 1)}
                      >
                        Approve
                      </button>
                    ) : userForEdit?.approved_status === 1 ? (
                      <></>
                    ) : (
                      // for temporary purpose
                      // <button
                      //   type="button"
                      //   className="btn btn-red"
                      //   onClick={() => UpdateApprovedStatus(user.Id, 2)}
                      // >
                      //   Reject
                      // </button>
                      <>
                        <button
                          type="button"
                          className="btn btn-green"
                          onClick={() => UpdateApprovedStatus(user.Id, 1)}
                        >
                          Approve
                        </button>

                        {/* //for temporary purpose */}
                        {/* <button
                          type="button"
                          className="btn btn-red"
                          onClick={() => UpdateApprovedStatus(user.Id, 2)}
                        >
                          Reject
                        </button> */}
                      </>
                    )
                  ) : null)}
              </>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
