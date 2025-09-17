import React, { useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { useSelector, shallowEqual } from "react-redux";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import {
  formatDates,
  getDateDiffInDays,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  isReaply,
  enableLoading,
  loading,
  isEdit,
  setId,
  payrollData,
  employeeId,
  empAuthorityList,
  isPolicyExists,
  currentLevel,
}) {
  //Get all leave types from dashboard global state
  //Get User Access for Edit and Create Save Button
  const { allLeaveTypes, userAccess, leaveBalances } = useSelector(
    (state) => ({
      allLeaveTypes: state.dashboard.allLeaveTypes,
      leaveBalances: state.leave_request?.leaveBalances,
      userAccess: state?.auth?.userAccess["Leave Request"],
    }),
    shallowEqual
  );
  //Check Access for creation and Updation
  const accessUser = useMemo(
    () =>
      userAccess?.find((item) => item?.componentName === "CreateLeaveRequest"),
    [userAccess, employeeId?.value]
  );

  //This ref is to get reference of file field. It will be used to clear field when reseting form
  const inputFile = useRef(null);

  //Validation for Form.
  //If payroll month is available then form should not allow to add date for before payroll month end date.
  //else just normal validation for form
  const formValidation = useMemo(() => {
    if (payrollData && payrollData.endDate) {
      return Yup.object().shape({
        from: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(
            payrollData.startDate,
            `Date cannot be before ${formatDates(payrollData.startDate)}`
          ),
        to: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("from"), "To date cannot be before From date")
          .test(
            "balance-check",
            "Leave days exceed available balance",
            function(to) {
              const { from, leaveType } = this.parent;
              if (!from || !to || !leaveType) return true; // skip if missing values

              const diffDays = getDateDiffInDays(from, to);
              const balance =
                leaveBalances?.find((el) => el?.leaveType === leaveType)
                  ?.remainingCount || 0;

              return diffDays <= balance; // ✅ enforce balance
            }
          ),
        leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
        days: Yup.number().when(["from", "to"], {
          is: (from, to) => from && to && getDateDiffInDays(from, to) == 1,
          then: Yup.number()
            .required(VALIDATION_MESSAGES.required)
            .oneOf([1, 0.5], "Days must be either 1 or 0.5"),
          otherwise: Yup.number().optional(),
        }),
        remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    } else {
      return Yup.object().shape({
        from: Yup.date().required(VALIDATION_MESSAGES.required),
        to: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("from"), "To date cannot be before From date")
          .test(
            "balance-check",
            "Leave days exceed available balance",
            function(to) {
              const { from, leaveType } = this.parent;
              if (!from || !to || !leaveType) return true; // skip if missing values

              const diffDays = getDateDiffInDays(from, to);
              const balance =
                leaveBalances?.find((el) => el?.leaveType === leaveType)
                  ?.remainingCount || 0;

              return diffDays <= balance; // ✅ enforce balance
            }
          ),
        leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
        days: Yup.number().when(["from", "to"], {
          is: (from, to) => from && to && getDateDiffInDays(from, to) == 1,
          then: Yup.number()
            .required(VALIDATION_MESSAGES.required)
            .oneOf([1, 0.5], "Days must be either 1 or 0.5"),
          otherwise: Yup.number().optional(),
        }),
        remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    }
  }, [payrollData, leaveBalances]);

  return (
    <>
      {/* Formik Start */}
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values, { resetForm }) => {
          enableLoading();
          //This clearForm function is created to clear form as well as clear any uploaded file as well.
          //resetForm function doesn't clear file properly so we use this function
          const clearForm = () => {
            resetForm();
            if (inputFile?.current) {
              inputFile.current.value = "";
            }
            setId("");
          };

          const payload = {
            ...values,

            from: values?.from ? formatDates(values.from, "dd-MMM-yyyy") : "", //should be null but in all places of portal "" are using that's why
            to: values?.to ? formatDates(values.to, "dd-MMM-yyyy") : "", //should be null but in all places of portal "" are using that's why
          };
          submitForm(payload, clearForm);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          handleReset,
        }) => (
          <>
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {empAuthorityList &&
            empAuthorityList?.length === 0 &&
            !isPolicyExists ? (
              <span className="text-xs text-red-500 font-semibold">
                Designation workflow policy does not exist for this employee.
              </span>
            ) : (
              empAuthorityList &&
              empAuthorityList?.length === 0 &&
              isPolicyExists && (
                <span className="text-xs text-gray-500 font-semibold">
                  Workflow Policy is defined but there is not Workflow
                  Authorities exists as per the policy.
                </span>
              )
            )}
            {/* Form Start */}
            <Form className="form form-label-right">
              <fieldset
                disabled={
                  (empAuthorityList && empAuthorityList?.length === 0) ||
                  employeeId?.level > 1
                }
              >
                {/* First Row Start */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {/* Leave Type Field Start */}
                  <div className="col-span-1">
                    <Field
                      name="leaveType"
                      component={Select}
                      disabled={isReaply || !employeeId?.value}
                      className={
                        errors?.leaveType && touched?.leaveType
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.target.value == "Select"
                            ? ""
                            : Number(e.target.value);
                        setFieldValue("leaveType", value);
                      }}
                      label={
                        <span>
                          {" "}
                          Leave Type<span style={{ color: "red" }}>*</span>{" "}
                        </span>
                      }
                      value={values.leaveType}
                      autoComplete="off"
                      children={CustomDropdown({ data: allLeaveTypes })}
                    />
                    {errors.leaveType && touched.leaveType && (
                      <CustomErrorLabel
                        touched={true}
                        error={errors.leaveType}
                      />
                    )}
                  </div>
                  {/* Leave Type Field End */}
                  {/* Date from Field Start */}
                  <div className="col-span-1">
                    <Field
                      name="from"
                      component={DatePickerField}
                      disabled={isEdit}
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date From<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(date) => {
                        setFieldValue("from", date);
                        setFieldValue(
                          "days",
                          getDateDiffInDays(date, values.to)
                        ); //Set difference in to from days in days key
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {/* Date from Field End */}

                  {/* Date to Field Start */}
                  <div className="col-span-1">
                    <Field
                      name="to"
                      component={DatePickerField}
                      disabled={isEdit}
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date To<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(date) => {
                        setFieldValue("to", date);
                        setFieldValue(
                          "days",
                          getDateDiffInDays(values.from, date)
                        ); //Set difference in to from days in days key
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {/* Date to Field End */}
                  {/* Days Field Start */}
                  <div className="col-span-1">
                    <Field
                      name="days"
                      component={Input}
                      className={
                        errors?.days &&
                        touched?.days &&
                        getDateDiffInDays(values.from, values.to) === 1
                          ? "form-control is-invalid"
                          : "form-control"
                      } //throw validation error if the difference in days is 1 day
                      disabled={
                        isEdit ||
                        getDateDiffInDays(values.from, values.to) !== 1
                      } //disable field if the difference in dates is more than 1 days
                      type="number"
                      min="0"
                      onChange={handleChange}
                      label={<span> Days</span>}
                    />
                  </div>
                  {/* Days Field End */}
                  {/* Days Field Start */}
                  <div className="col-span-1">
                    <Field
                      name="days"
                      component={Input}
                      className={"form-control"} //throw validation error if the difference in days is 1 day
                      disabled={true}
                      type="number"
                      min="0"
                      value={
                        values?.leaveType
                          ? leaveBalances?.find(
                              (el) => el?.leaveType === values.leaveType
                            )?.remainingCount || ""
                          : ""
                      }
                      onChange={handleChange}
                      label={<span>Balance</span>}
                    />
                  </div>
                  {/* Days Field End */}
                </div>
                {/* First Row End */}

                {/* Second Row Start */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-3">
                  {/* Remarks Field Start */}
                  <div className="col-span-4">
                    <Field
                      name="remarks"
                      component={TextArea}
                      placeholder=""
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label={
                        <span>
                          {" "}
                          Reason<span style={{ color: "red" }}> *</span>
                        </span>
                      }
                      value={values.remarks}
                      autoComplete="off"
                    />
                  </div>
                  {/* Remarks Field End */}
                  <div className="col-span-1">
                    <label
                      htmlFor="file_input"
                      // className="block mb-2 text-xs font-normal text-gray-900"
                    >
                      Attachment
                    </label>

                    {/* Hidden input */}
                    <input
                      id="file_input"
                      name="file"
                      type="file"
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                    />

                    {/* Styled label as upload box */}
                    <label
                      htmlFor="file_input"
                      className="form-control block w-full cursor-pointer"
                    >
                      {values.file ? values.file.name : "Upload"}
                    </label>

                    {/* Show existing file if any */}
                    {values.fileName && values.file === values.fileName && (
                      <div className="mt-2">
                        <strong>Existing File: </strong>
                        <a
                          href={getUploadUrl(values.fileName)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {getFileName(values.fileName)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>
            </Form>
            {/* Form End */}

            <Modal.Footer>
              {/* Cancel button Start */}
              <button
                type="reset"
                onClick={() => {
                  setId("");
                  handleReset();
                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}
                className="btn btn-light btn-elevate"
              >
                Clear
              </button>
              {/* Cancel button End */}

              {/* Save button Start */}
              {employeeId?.value && accessUser ? (
                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Submit Request
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              ) : (
                <></>
              )}
              {/* Save button End */}
            </Modal.Footer>
          </>
        )}
      </Formik>
      {/* Formik End */}
    </>
  );
}
