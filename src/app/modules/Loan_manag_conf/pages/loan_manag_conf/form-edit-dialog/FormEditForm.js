import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,

  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { amountLimit } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { toast } from "react-toastify";

// Define the validation schema for the main form and the details
const loanManagementSchema = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  accountId: Yup.number().required(VALIDATION_MESSAGES.required),

  emp_loan_account: Yup.number().required(VALIDATION_MESSAGES.required),
  // installment_deduction_percentage: Yup.number()
  //   .min(0, "Must be at least 0")
  //   .max(100, "Must be at most 100")
  //   .required("Installment Deduction Percentage is required"),

  // installment_deduction_percentage: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue).max(100, VALIDATION_MESSAGES.maxHundredValue).test(
  //   'max-decimals',
  //   VALIDATION_MESSAGES.minZeroValue,
  //   (value) => /^\d{1,4}(\.\d{1,2})?$/.test(value?.toString())
  // ).required(VALIDATION_MESSAGES.required),


  // installment_deduction_basis_type: Yup.number()
  // .nullable(),
  // .required(VALIDATION_MESSAGES.required),
  details: Yup.array().of(
    Yup.object().shape({
      loan_typeId: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .notOneOf([''], "Type is required"),

      max_loan_amount: Yup.number()
      .nullable()
        .min(1, "Must be at least 1")
        .required(VALIDATION_MESSAGES.required),
      // basis: Yup.number().required(VALIDATION_MESSAGES.required),

      max_no_of_installment_for_loan: Yup.number()
      .nullable()
      .min(1, VALIDATION_MESSAGES.minOneValue)
      .max(99, "Must be at most 99")
      .required(VALIDATION_MESSAGES.required),


      installment_start_date_policy: Yup.number()
      .nullable()
      .min(1, VALIDATION_MESSAGES.minOneValue)
      .max(12, "Must be at most 12")
      .required(VALIDATION_MESSAGES.required),
      salary_count: Yup.number()
        .min(0, VALIDATION_MESSAGES.minZeroValue)
        .max(99, "Must be at most 99")
        .required(VALIDATION_MESSAGES.required)
        .when('basis', {
          is: (basis) => basis == 0 || basis == 1, // Check if basis is 0 or 1
          then: Yup.number().min(1,VALIDATION_MESSAGES.minOneValue),
          otherwise: Yup.number().min(0, VALIDATION_MESSAGES.minZeroValue),
        })
        .test(
          "salary-count-ge-max-loan-amount", // Name of the test
          "Can't be greater", // Error message
          function (value) {
            const { max_loan_amount } = this.parent; // Accessing max_loan_amount from the parent object
            if (value > max_loan_amount) {
              return false; // Validation fails
            }
            return true; // Validation passes
          }
        ),


        eligibilityPolicy: Yup.number()
        .required(VALIDATION_MESSAGES.required)
        .nullable()
        .min(1, VALIDATION_MESSAGES.minOneValue)
        .max(999, "Must be at most 999"),


        monthsToApplyForNewLoan: Yup.number()
        .when('isAllowMultipleLoans', {
          is: false, // Only validate if isAllowMultipleLoans is false
          then: Yup.number()
          .nullable()
            .min(1, VALIDATION_MESSAGES.minOneValue)
            .max(999, "Must be at most 999")
            .required(VALIDATION_MESSAGES.required),
          otherwise: Yup.number().nullable() // If isAllowMultipleLoans is true, no validation
        })
    })
  ),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,disableLoading
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // getAllLoanType
  // Fetch necessary data if not already present
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      // dispatch(fetchAllFormsMenu(45, "allAccountList")); // For All Accounts
      dispatch(fetchAllFormsMenu(45, "allAccountList", null, true));
      dispatch(actions.getAllLoanType()); // For All Loan Types
      
    }
  }, [dispatch, user.Id]);

  // Define options for basis type
  const basisOptions = [
    // { value: null, label: "N/A" },
    { value: 0, label: "Gross" },
    { value: 1, label: "Basic" },
  ];

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.loan_management_configuration,
      userAccess: state?.auth?.userAccess["loan_management_configuration"],
    };
  }, shallowEqual);

  const { entities, loan_type } = currentState;

  let existedId = 0;
  const check_Existed_Data = (subsidiaryId) => {

    entities.forEach((i) => {
      if (i.subsidiaryId == subsidiaryId) {
        existedId = i.Id;

        dispatch(actions.fetchLoanManagConfig(existedId));
      } else {
        dispatch(actions.fetchLoanManagConfig(0));
      }
    });
  };

  const deleteLoanManagConfigDetail = (Id,loan_typeId,subsidiaryId) => {
    // server request for deleting customer by id
    enableLoading();
    let data={
     Id, loan_typeId,subsidiaryId
    }
    dispatch(actions.deleteLoanManagConfigDetail(data)).then(() => {
      onHide();
     
      disableLoading();
    });
  };

    const deleteNotification = () => {
      toast("Loan policy cannot be empty.");

    };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={loanManagementSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
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
                  {/* Subsidiary Field */}
                  <div className="col-12 col-md-12  p-0 m-0">
                    <div className="col-12 col-md-6">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          check_Existed_Data(e.value);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option?.value === values?.subsidiaryId
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

                  {/* Account Field */}
                  <div className="col-12 col-md-6 mt-3">
                    <SearchSelect
                      name="accountId"
                      label={
                        <span>
                          Account<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("accountId", e.value || null);
                      }}
                      value={
                        dashboard?.allAccountList?.find(
                          (option) => option?.value === values?.accountId
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard?.allAccountList?.map((option) => ({
                        label: `${option?.mergeLabel}`, // Adding the value to the label
                        value: option.value,
                      }))}
                      error={errors.accountId}
                      touched={touched.accountId}
                    />
                  </div>

                  

                  {/* Employee Loan Account Field */}
                  <div className="col-12 col-md-6 mt-3">
                    {/* <Field
                      name="emp_loan_account"
                      component={Input}
                      placeholder="Enter employee loan account"
                      label="Employee Loan Account"
                      type="number"
                      disabled={isUserForRead}
                    /> */}

                    <SearchSelect
                      name="emp_loan_account"
                      label={
                        <span>
                          Employee Loan Account
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("emp_loan_account", e.value || null);
                      }}
                      value={
                        dashboard?.allAccountList?.find(
                          (option) => option?.value === values?.emp_loan_account
                        ) || null
                      }
                      // options={dashboard.allAccountList}
                      options={dashboard?.allAccountList?.map((option) => ({
                        label: `${option?.mergeLabel}`, // Adding the value to the label
                        value: option?.value,
                      }))}
                      error={errors.accountId}
                      touched={touched.accountId}
                    />
                  </div>

                  {/* Installment Deduction Percentage Field */}


                  {/* Installment Deduction Basis Type Field */}
                  <div className="col-12 col-md-6 mt-3">
                    <label htmlFor="installment_deduction_basis_type">
                      Installment Deduction Basis Type
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                    {/* <Field
                      name="installment_deduction_basis_type"
                      as="select"
                      label="Installment Deduction Basis Type"
                      className="form-control"
                      disabled={isUserForRead}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setFieldValue(
                          "installment_deduction_basis_type",
                          value
                        );
                      }}
                    >
                      <option value="">Select Deduction Basis Type</option>
                      {basisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field> */}
                    <Field
                      name="installment_deduction_basis_type"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      onChange={(e) => {
                 
                        setFieldValue("installment_deduction_basis_type", e.target.value === 'N/A' ? null : e.target.value);
                    
                        if (e.target.value =='N/A') {
                          setFieldValue("installment_deduction_percentage", 0)
                        }
                      }}


                    >
                      {/* <option value="">Select</option> */}
                      {/* {basisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))} */}

                      {[
                        { value: null, label: 'N/A' }, // This renders the "N/A" option
                        ...basisOptions, // This renders the rest of the options
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>

                    {errors.installment_deduction_basis_type &&
                      touched.installment_deduction_basis_type && (
                        <div className="text-danger">
                          {errors.installment_deduction_basis_type}
                        </div>
                      )}
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <Field
                      name="installment_deduction_percentage"
                      component={Input}
                      placeholder="Enter installment deduction percentage"
                      label={
                        <span>
                          Installment Deduction (%)
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>
                      }
                      type="number"
                      disabled={isUserForRead || values.installment_deduction_basis_type=="N/A" || !values.installment_deduction_basis_type }
                      onChange={(e) => {
                        if (Number(e.target.value) <= 100) {
                          // e.target.value = e.target.value.slice(0,5);
                          if (/^\d{0,3}(\.\d{1,2})?$/.test(e.target.value?.toString())) {
                            setFieldValue("installment_deduction_percentage", e.target.value)

                          }
                        }
                      }}
                    />

                  </div>
                </div>
              </fieldset>

              <FieldArray name="details">
                {({ push, remove }) => (
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      padding: "20px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                      marginTop: "20px",
                    }}
                  >
                    <h6>Details</h6>
                    <table className="table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <thead>
                        <tr
                          style={{ backgroundColor: "#4d5f7a", color: "#fff" }}
                        >
                          <th>Action</th>


                          <th>Loan Type</th>
                          <th>Max Loan Amount</th>
                          <th>Basis</th>
                          <th>Salary Count</th>
                          <th>Max. No. of Installment for Loan</th>
                          <th>Installment Start date Policy</th>

                          <th>Allow Multiple Loans at a time</th>
                          <th>Months required to apply for new loan</th>
                          <th>Eligibility policy for new loan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.details &&
                          values.details.length > 0 &&
                          values.details.map((detail, index) => (
                            <tr key={index}>
                              <td>
                                {!isUserForRead && (
                                  <button
                                    type="button"
                                    // onClick={() => remove(index)}
                                    onClick={() => {
                                      if (values.details[index]?.Id && values.details.length>1 ) {
                                        deleteLoanManagConfigDetail(values.details[index]?.Id,values.details[index]?.loan_typeId, values.subsidiaryId);
                                      }
                                      else if(values.details[index]?.Id && values.details.length==1){
                                        deleteNotification()
                                      }
                                      
                                      else {
                                        remove(index);
                                      }
                                    }}
                                    className="btn btn-danger btn-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>

                              <td>
                                <Field
                                  name={`details[${index}].loan_typeId`}
                                  as="select"
                                  className="form-control"
                                  style={{ width: '130px' }}
                                  // disabled={isUserForRead}
                                  disabled={isUserForRead || values.details[index]?.Id}
                                >


                                  <option value="">Select--</option>


                                  {loan_type
                                    ?.filter((x) => x.subsidiaryId?.includes(String(values.subsidiaryId))) // Filter options based on subsidiaryId
                                    .map((x) => (
                                      <option
                                        key={x.value} // Ensure each option has a unique key
                                        disabled={values.details.find((el) => el.loan_typeId === x.value) ? true : false}
                                        value={x.value}
                                      >
                                        {x.label}
                                      </option>
                                    ))}
                                </Field>
                                {errors.details?.[index]?.loan_typeId &&
                                  touched.details?.[index]?.loan_typeId && (
                                    <div className="text-danger">
                                      {errors.details[index]?.loan_typeId}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <Field
                                  name={`details[${index}].max_loan_amount`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '80px' }}
                                  disabled={isUserForRead}
                                  onInput={(e) => {
                                    e.target.value = amountLimit(e.target.value); // Limit to 3 digits
                                  }}

                                  onChange={(e) => {
                 
                                    setFieldValue(`details[${index}].max_loan_amount`, e.target.value);
                                 
                                    
                                      setFieldValue(`details[${index}].salary_count`, 0)
                                  
                                  }}
                                />
                                {errors.details?.[index]?.max_loan_amount &&
                                  touched.details?.[index]?.max_loan_amount && (
                                    <div className="text-danger">
                                      {errors.details[index].max_loan_amount}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <Field
                                  name={`details[${index}].basis`}
                                  as="select"
                                  className="form-control"
                                  style={{ width: '85px' }}
                                  disabled={isUserForRead}
                                  onChange={(e) => {
                 
                                    setFieldValue(`details[${index}].basis`, e.target.value === 'N/A' ? null : e.target.value);
                                  
                                    if (e.target.value =='N/A') {
                                      setFieldValue(`details[${index}].salary_count`, 0)
                                    }
                                  }}
                                >
                                  {/* <option value="">Select</option>
                                  {basisOptions.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))} */}

{[
                        { value: null, label: 'N/A' }, // This renders the "N/A" option
                        ...basisOptions, // This renders the rest of the options
                      ].map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                                </Field>
                                {errors.details?.[index]?.basis &&
                                  touched.details?.[index]?.basis && (
                                    <div className="text-danger">
                                      {errors.details[index].basis}
                                    </div>
                                  )}
                              </td>

                              <td>
                                <Field
                                  name={`details[${index}].salary_count`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '60px' }}
                                  // disabled={isUserForRead}
                                  disabled={isUserForRead || values.details[index]?.basis=='N/A' || !values.details[index]?.basis }
                                  onInput={(e) => {
                                    if (e.target.value.length > 2) {
                                      e.target.value = e.target.value.slice(0, 2); // Restrict to 2 digits
                                    }
                                  }}
                                />
                                {errors.details?.[index]?.salary_count &&
                                  touched.details?.[index]?.salary_count && (
                                    <div className="text-danger">
                                      {errors.details[index].salary_count}
                                    </div>
                                  )}
                              </td>


                              <td>
                                <Field
                                  name={`details[${index}].max_no_of_installment_for_loan`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '60px' }}
                                  disabled={isUserForRead}
                                
                                  onInput={(e) => {
                                    if (e.target.value.length > 2) {
                                      e.target.value = e.target.value.slice(0, 2); // Restrict to 2 digits
                                    }
                                  }}
                                />
                                {errors.details?.[index]?.max_no_of_installment_for_loan &&
                                  touched.details?.[index]?.max_no_of_installment_for_loan && (
                                    <div className="text-danger">
                                      {errors.details[index].max_no_of_installment_for_loan}
                                    </div>
                                  )}
                              </td>


                              <td>
                                <Field
                                  name={`details[${index}].installment_start_date_policy`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '60px' }}
                                  disabled={isUserForRead}
                                  onInput={(e) => {
                                    if (e.target.value.length > 2) {
                                      e.target.value = e.target.value.slice(0, 2); // Restrict to 2 digits
                                    }
                                  }}
                                />
                                {errors.details?.[index]?.installment_start_date_policy &&
                                  touched.details?.[index]?.installment_start_date_policy && (
                                    <div className="text-danger">
                                      {errors.details[index].installment_start_date_policy}
                                    </div>
                                  )}
                              </td>



                              <td>
                                <input
                                  name={`details[${index}].isAllowMultipleLoans`}
                                    type="checkbox"
                                  
                                  disabled={isUserForRead}
                                  checked={values.details?.[index]?.isAllowMultipleLoans}
                                  onChange={(e)=> { setFieldValue(`details[${index}].isAllowMultipleLoans`, e.target.checked)
                                
                                  if (e.target.checked) {
                                    setFieldValue(`details[${index}].monthsToApplyForNewLoan`, '');
                                  }
                                  }
                                }
                                  
                                />
                                {errors.details?.[index]?.isAllowMultipleLoans &&
                                  touched.details?.[index]?.isAllowMultipleLoans && (
                                    <div className="text-danger">
                                      {errors.details[index].isAllowMultipleLoans}
                                    </div>
                                  )}
                              </td>


                              <td>
                                <Field
                                  name={`details[${index}].monthsToApplyForNewLoan`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '60px' }}
                                  disabled={isUserForRead || values.details?.[index]?.isAllowMultipleLoans}
                                  onInput={(e) => {
                                    if (e.target.value.length > 3) {
                                      e.target.value = e.target.value.slice(0, 3); // Restrict to 2 digits
                                    }
                                  }}
                                />
                                {errors.details?.[index]?.monthsToApplyForNewLoan &&
                                  touched.details?.[index]?.monthsToApplyForNewLoan && (
                                    <div className="text-danger">
                                      {errors.details[index].monthsToApplyForNewLoan}
                                    </div>
                                  )}
                              </td>



                              <td>
                                <Field
                                  name={`details[${index}].eligibilityPolicy`}
                                  type="number"
                                  className="form-control"
                                  style={{ width: '60px' }}
                                  disabled={isUserForRead}
                                  onInput={(e) => {
                                    if (e.target.value.length >3) {
                                      e.target.value = e.target.value.slice(0, 3); // Restrict to 2 digits
                                    }
                                  }}
                                />
                                {errors.details?.[index]?.eligibilityPolicy &&
                                  touched.details?.[index]?.eligibilityPolicy && (
                                    <div className="text-danger">
                                      {errors.details[index].eligibilityPolicy}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>

                    {!isUserForRead && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            loan_typeId: "",
                            max_loan_amount: "",
                            basis: null,
                            salary_count: "",
                            max_no_of_installment_for_loan: "",
                            installment_start_date_policy: "",
                            isAllowMultipleLoans:true,
                            monthsToApplyForNewLoan:"",
                            eligibilityPolicy:"",

                          })
                        }
                        className="btn btn-primary btn-sm"
                      >
                        + Add Detail
                      </button>
                    )}
                  </div>
                )}
              </FieldArray>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {/* Cancel / Ok Button */}
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                // onClick={() => clear_Existed_Data()}

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
            {/* {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={loading}
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )} */}

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
                disabled={loading || values?.details?.length === 0} // Disable if loading or no details
              >
                Save
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
