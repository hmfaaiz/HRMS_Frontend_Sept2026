import React, { useEffect, useMemo, useRef } from "react";
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
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import {
  formatDates,
  getDateDiffInDays,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import LeaveLinesTable from "./LeaveLinesTable";
import * as actions from "../../../_redux/formActions";
import moment from "moment";

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  enableLoading,
  loading,
  isEdit,
  setId,
  payrollData,
  employeeId,
  initialValue,
  disbaleLoading,
}) {
  //Get all leave types from dashboard global state
  //Get User Access for Edit and Create Save Button
  const dispatch = useDispatch();
  const {
    allLeaveTypes,
    userAccess,
    leaveBalances,
    sandwichPolicy,
  } = useSelector(
    (state) => ({
      allLeaveTypes: state.dashboard.allLeaveTypes,
      leaveBalances: state.leave_application?.leaveBalances,
      sandwichPolicy: state.leave_application?.sandwichPolicy,
      userAccess: state?.auth?.userAccess["Leave_Application"],
    }),
    shallowEqual
  );
  //Check Access for creation and Updation
  const accessUser = useMemo(
    () =>
      userAccess.find(
        (item) =>
          item.componentName === "CreateLeaveApplication" ||
          item.componentName === "UpdateLeaveApplication"
      ),
    [userAccess]
  );

  //This ref is to get reference of file field. It will be used to clear field when reseting form
  const inputFile = useRef(null);
  const formikRef = useRef(null);
  //Validation for Form.
  //If payroll month is available then form should not allow to add date for before payroll month end date.
  //else just normal validation for form
  const formValidation = useMemo(() => {
    const startDate = payrollData?.startDate
      ? new Date(payrollData.startDate)
      : null;
    const endDate = payrollData?.endDate ? new Date(payrollData.endDate) : null;
    if (payrollData && startDate && endDate) {
      return Yup.object().shape({
        from: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(
            startDate,
            `Date cannot be before ${formatDates(payrollData.startDate)}`
          ),
        to: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("from"), "To date cannot be before From date")
          .test(
            "balance-check",
            "Leave days exceed available balance",
            function(to) {
              const { from, leaveType, days } = this.parent;
              // if sandwich is disabled → skip balance check completely
              if (sandwichPolicy?.isSandwich == 0) return true;
              if (!from || !to || !leaveType) return true; // skip if missing values

              const diffDays = days || getDateDiffInDays(from, to);
              const leaveTypeRecord = leaveBalances?.find(
                (el) => el?.leaveType === leaveType
              );
              const balance =
                (leaveTypeRecord?.remainingCount ?? 0) +
                (leaveTypeRecord?.negativeCount ?? 0);
              return diffDays <= balance; //  enforce balance
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
              const { from, leaveType, days } = this.parent;
              // if sandwich is disabled → skip balance check completely
              if (sandwichPolicy?.isSandwich == 0) return true;

              if (!from || !to || !leaveType) return true; // skip if missing values

              const diffDays = days || getDateDiffInDays(from, to);
              const leaveTypeRecord = leaveBalances?.find(
                (el) => el?.leaveType === leaveType
              );

              const balance =
                (leaveTypeRecord?.remainingCount ?? 0) +
                (leaveTypeRecord?.negativeCount ?? 0);

              return diffDays <= balance; //  enforce balance
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
  }, [payrollData, leaveBalances, sandwichPolicy]);

  const getLeaveLines = (values, errors) => {
    let valuesExists = values?.leaveType && values?.from && values?.to;
    if (valuesExists && employeeId) {
      const payload = {
        ...values,
        to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
        from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
        days: values?.days
          ? values?.days
          : getDateDiffInDays(values?.from, values?.to),
      };
      dispatch(
        actions.getLeaveApplicationDetail(payload, employeeId, disbaleLoading)
      );
    }
  };

  const validateAndFetch = async (
    updatedValues,
    validateForm,
    setFieldValue
  ) => {
    setFieldValue("leaveLines", []);
    const formErrors = await validateForm(updatedValues);

    const isValid =
      !formErrors?.leaveType && !formErrors?.from && !formErrors?.to;

    if (isValid) {
      getLeaveLines(updatedValues, formErrors);
    }
  };

  useEffect(() => {
    if (employeeId) {
      // you need to get Formik's resetForm method
      if (formikRef.current) {
        formikRef.current.resetForm({ values: initialValue });
      }
      if (inputFile?.current) inputFile.current.value = "";
    }
  }, [employeeId]);

  return (
    <>
      {/* Formik Start */}
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values, { resetForm }) => {
          enableLoading();
          //This clearForm function is created to clear form as well as clear any uploaded file as well.
          //resetForm function doesn't clear file properly so we use this function
          const clearForm = () => {
            if (inputFile?.current) {
              inputFile.current.value = "";
            }

            resetForm({ values: initialValue }); // resets values, errors, touched
          };

          const payload = {
            ...values,
            to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
            from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
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
          setValues,
          validateForm,
        }) => (
          <div className="mt-2">
            {/* Modal Body Start */}
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {/* Form Start */}
            <Form className="form form-label-right">
              <fieldset>
                {/* First Row Start */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-x-3">
                  {/* Active payroll month */}

                  {/* <div className="col-12 col-md-12 mt-3 d-flex flex-column align-items-end">

  {activeFiscalYear ? (() => {

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
  })() : null}
</div> */}
                  {/* Leave Type Field Start */}
                  <div>
                    <Field
                      name="leaveType"
                      component={Select}
                      disabled={isEdit || !employeeId}
                      className={
                        errors?.leaveType && touched?.leaveType
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={async (e) => {
                        const value =
                          e.target.value == "Select"
                            ? ""
                            : Number(e.target.value);
                        setFieldValue("leaveType", value);
                        await validateAndFetch(
                          { ...values, leaveType: value },
                          validateForm,
                          setFieldValue
                        );
                      }}
                      label={
                        <span>
                          {" "}
                          Leave Type<span style={{ color: "red" }}>*</span>
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
                  <div>
                    <Field
                      name="from"
                      component={DatePickerField}
                      disabled={
                        isEdit
                        // || values?.leaveLines?.length > 0
                      }
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date From<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={async (date) => {
                        setFieldValue("from", date);
                        setFieldValue(
                          "days",
                          getDateDiffInDays(date, values.to)
                        ); //Set difference in to from days in days key
                        // getLeaveLines({ ...values, from: date }, errors);
                        await validateAndFetch(
                          { ...values, from: date },
                          validateForm,
                          setFieldValue
                        );
                      }}
                      autoComplete="off"
                    />
                    {errors["from"] && (
                      <div style={{ color: "#F64E60", fontSize: "0.7rem" }}>
                        {errors["from"]}
                      </div>
                    )}
                  </div>
                  {/* Date from Field End */}

                  {/* Date to Field Start */}
                  <div>
                    <Field
                      name="to"
                      component={DatePickerField}
                      disabled={
                        isEdit
                        // || values?.leaveLines?.length > 0
                      }
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date To<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={async (date) => {
                        setFieldValue("to", date);
                        setFieldValue(
                          "days",
                          getDateDiffInDays(values.from, date)
                        ); //Set difference in to from days in days key
                        await validateAndFetch(
                          { ...values, to: date },
                          validateForm,
                          setFieldValue
                        );
                      }}
                      autoComplete="off"
                    />
                    {errors["to"] && (
                      <div style={{ color: "#F64E60", fontSize: "0.7rem" }}>
                        {errors["to"]}
                      </div>
                    )}
                  </div>
                  {/* Date to Field End */}

                  {/* Days Field Start */}
                  <div>
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
                        // ||
                        // values?.leaveLines?.length > 0
                      } //disable field if the difference in dates is more than 1 days
                      type="number"
                      min="0"
                      onChange={async (e) => {
                        setFieldValue("days", e?.target?.value);
                        await validateAndFetch(
                          { ...values, days: e?.target.value },
                          validateForm,
                          setFieldValue
                        );
                      }}
                      label={<span> Days</span>}
                    />
                  </div>
                  {/* Days Field End */}

                  {/* First Row End */}

                  {/* Second Row Start */}
                  <div>
                    <Field
                      name="balance"
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
                  {/* File Field End */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  {/* Remarks Field Start */}
                  <div className="col-span-4">
                    <Field
                      name="remarks"
                      component={TextArea}
                      placeholder=""
                      onChange={handleChange}
                      disabled={isEdit}
                      onBlur={handleBlur}
                      label={
                        <span>
                          {" "}
                          Remarks<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={values.remarks}
                      autoComplete="off"
                    />
                  </div>
                  {/* Remarks Field End */}
                  {/* Second Row End */}
                  {/* Third Row Start */}

                  {/* File Field Start */}
                  {/* <div className="col-span-1">
                    <FileUpload
                      label={"Attachment"}
                      name="file"
                      onChange={(event) => {
                        // Update Formik's value
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                      fileName={values?.file?.name || values.fileName}
                      inputFile={inputFile}
                      accept={".jpeg,.jpg,.png,.pdf,.doc,.docx"}
                    />
                  </div> */}

                  <div className="col-span-1">
                    <FileUpload
                      label={<>Attachment</>}
                      id="file"
                      name="file"
                      type="file"
                      isEdit={
                        isEdit
                        // || values?.leaveLines?.length > 0
                      }
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      ref={inputFile}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("file", file);
                      }}
                    />

                    {(user?.file || values?.file) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.file || user?.file) === "string"
                              ? getUploadUrl(values?.file || user?.file)
                              : URL.createObjectURL(values?.file || user?.file)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.file || user?.file) === "string"
                            ? getFileName(values?.file || user?.file)
                            : values?.file?.name || user?.file}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {/* Third Row End */}
              </fieldset>
            </Form>
            {/* Form End */}
            {/* Modal Body End */}
            <LeaveLinesTable
              values={values}
              setFieldValue={setFieldValue}
              isEdit={isEdit}
            />
            <Modal.Footer>
              {/* Cancel button Start */}
              <button
                // type="reset"
                onClick={() => {
                  setId("");
                  // handleReset();
                  // if (inputFile?.current) {
                  //   inputFile.current.value = "";
                  // }
                  setValues(initialValue);
                }}
                className="btn btn-light btn-elevate"
              >
                Clear
              </button>
              {/* Cancel button End */}

              {/* Save button Start */}
              {employeeId && accessUser && !isEdit ? (
                <button
                  type="submit"
                  disabled={loading || values?.leaveLines?.length == 0}
                  onClick={() => handleSubmit()}
                  className="btn btn-primary btn-elevate"
                >
                  Save
                  {loading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              ) : (
                <></>
              )}
              {/* Save button End */}
            </Modal.Footer>
          </div>
        )}
      </Formik>
      {/* Formik End */}
    </>
  );
}
