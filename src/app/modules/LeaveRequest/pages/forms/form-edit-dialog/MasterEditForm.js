import React, { useMemo, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { useSelector, shallowEqual } from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { formatDates, getDateDiffInDays, getFileName, getUploadUrl } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";



export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  enableLoading,
  loading,
  isEdit,
  setId,
  payrollData,
  employeeId
}) {

  //Get all leave types from dashboard global state
  //Get User Access for Edit and Create Save Button
  const { allLeaveTypes, userAccess } = useSelector(
    (state) => ({
      allLeaveTypes: state.dashboard.allLeaveTypes,
      userAccess: state?.auth?.userAccess["Leave_Application"],
    }),
    shallowEqual
  )

  //Check Access for creation and Updation
  const accessUser = useMemo(() =>
    userAccess?.find(
      (item) =>
        item?.componentName === "CreateLeaveApplication" ||
        item?.componentName === "UpdateLeaveApplication"
    ),
    [userAccess]
  );

  //This ref is to get reference of file field. It will be used to clear field when reseting form
  const inputFile = useRef(null);

  //Validation for Form.
  //If payroll month is available then form should not allow to add date for before payroll month end date.
  //else just normal validation for form
  const formValidation = useMemo(() => {
    if (payrollData && payrollData.endDate) {
      return Yup.object().shape({
        from: Yup.date().required(VALIDATION_MESSAGES.required).min(payrollData.startDate, `Date cannot be before ${formatDates(payrollData.startDate)}`),
        to: Yup.date().required(VALIDATION_MESSAGES.required).min(Yup.ref('from'), 'To date cannot be before From date'),
        leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
        days: Yup.number()
          .when(['from', 'to'], {
            is: (from, to) => from && to && getDateDiffInDays(from, to) == 1,
            then: Yup.number()
              .required(VALIDATION_MESSAGES.required)
              .oneOf([1, 0.5], 'Days must be either 1 or 0.5'),
            otherwise: Yup.number().optional()
          }),
        remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      })
    }
    else {
      return Yup.object().shape({
        from: Yup.date().required(VALIDATION_MESSAGES.required),
        to: Yup.date().required(VALIDATION_MESSAGES.required).min(Yup.ref('from'), 'To date cannot be before From date'),
        leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
        days: Yup.number()
          .when(['from', 'to'], {
            is: (from, to) => from && to && getDateDiffInDays(from, to) == 1,
            then: Yup.number()
              .required(VALIDATION_MESSAGES.required)
              .oneOf([1, 0.5], 'Days must be either 1 or 0.5'),
            otherwise: Yup.number().optional()
          }),
        remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      })
    }
  }, [payrollData])

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
          }
          submitForm(values, clearForm)
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
          handleReset
        }) => (
          <>
            {/* Modal Body Start */}
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              {/* Form Start */}
              <Form className="form form-label-right">
                <fieldset>

                  {/* First Row Start */}
                  <div className="from-group row">

                    {/* Date from Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="from"
                        component={DatePickerField}
                        disabled={isEdit}
                        dateFormat="dd/MM/yyyy"
                        label={
                          <span>
                            {" "}
                            Date From<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(date) => {
                          setFieldValue('from', date)
                          setFieldValue('days', getDateDiffInDays(date, values.to)) //Set difference in to from days in days key
                        }}
                        autoComplete="off"
                      />
                    </div>
                    {/* Date from Field End */}

                    {/* Date to Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="to"
                        component={DatePickerField}
                        disabled={isEdit}
                        dateFormat="dd/MM/yyyy"
                        label={
                          <span>
                            {" "}
                            Date To<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(date) => {
                          setFieldValue('to', date)
                          setFieldValue('days', getDateDiffInDays(values.from, date)) //Set difference in to from days in days key
                        }}
                        autoComplete="off"
                      />
                    </div>
                    {/* Date to Field End */}

                    {/* Days Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="days"
                        component={Input}
                        className={errors?.days && touched?.days && getDateDiffInDays(values.from, values.to) === 1 ? 'form-control is-invalid' : 'form-control'} //throw validation error if the difference in days is 1 day
                        disabled={isEdit || getDateDiffInDays(values.from, values.to) !== 1} //disable field if the difference in dates is more than 1 days
                        type="number"
                        min="0"
                        onChange={handleChange}
                        label={
                          <span>
                            {" "}
                            Days
                          </span>
                        }
                      />
                    </div>
                    {/* Days Field End */}
                  </div>
                  {/* First Row End */}

                  {/* Second Row Start */}
                  <div className="from-group row">

                    {/* Leave Type Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="leaveType"
                        component={Select}
                        disabled={isEdit || !employeeId}
                        className={errors?.leaveType && touched?.leaveType ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                          setFieldValue('leaveType', value)
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
                      {
                        errors.leaveType && touched.leaveType && <CustomErrorLabel touched={true} error={errors.leaveType} />
                      }
                    </div>
                    {/* Leave Type Field End */}

                    {/* Remarks Field Start */}
                    <div className="col-12 col-md-8 mt-3">
                      <Field
                        name="remarks"
                        component={TextArea}
                        placeholder=""
                        onChange={handleChange}
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
                  </div>
                  {/* Second Row End */}

                  {/* Third Row Start */}
                  <div className="from-group row">

                    {/* File Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <label style={{ 'margin-right': '0.5rem' }}>
                        {" "}
                        Attachment: {" "}
                      </label>
                      <input
                        name="file"
                        type="file"
                        accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                        ref={inputFile}
                        onChange={(event) => {
                          // Update Formik's value
                          const file = event.currentTarget.files[0];
                          setFieldValue("file", file);
                        }}
                      />
                      <div>
                        <br />
                        {values.fileName && values.file == values.fileName &&
                          <>
                            <label><strong>Existing File:</strong></label>
                            {<a href={getUploadUrl(values.fileName)} target="_blank"><span>{getFileName(values.fileName)}</span></a>}
                          </>
                        }
                      </div>
                    </div>
                    {/* File Field End */}
                  </div>
                  {/* Third Row End */}
                </fieldset>
              </Form>
              {/* Form End */}
            </Modal.Body>
            {/* Modal Body End */}


            <Modal.Footer>
              {/* Cancel button Start */}
              <button
                type="reset"
                onClick={() => {
                  setId('')
                  handleReset()
                  if (inputFile?.current) {
                    inputFile.current.value = "";
                  }
                }}
                className="btn btn-danger btn-elevate"
              >
                Clear
              </button>
              {/* Cancel button End */}

              {/* Save button Start */}
              {employeeId && accessUser ? <button
                type="submit"
                disabled={loading}
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> : <></>}
              {/* Save button End */}
            </Modal.Footer>
          </>
        )}
      </Formik >
      {/* Formik End */}
    </>
  );
}
