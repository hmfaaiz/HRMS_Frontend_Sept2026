import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { formatDates } from "../../../../../utils/common";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { TimeInput } from "../../../../../../_metronic/_partials/controls/forms/TimeInput";

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  onHide,
  enableLoading,
  loading,
  employeeId,
}) {
  const { payrollData } = useSelector(
    (state) => ({
      payrollData: state.attendance_request.payrollData,
    }),
    shallowEqual
  );

  //Validation for Form.
  //If payroll month is available then form should not allow to add date for before payroll month end date.
  //else just normal validation for form
  const formValidation = useMemo(() => {
    if (payrollData && payrollData.endDate) {
      return Yup.object().shape({
        attDateIn: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .min(
            payrollData.startDate,
            `Date cannot be before ${formatDates(payrollData.startDate)}`
          ),
        attDateOut: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("attDateIn"), "Date Out cannot be before Date in date")
          .test(
            "max-3-days",
            "Date Out cannot be more than 3 days after Date In",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true; // If either value is missing, let other validations handle it
              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));
              const diffInDays = (dateOut - dateIn) / (1000 * 60 * 60 * 24);
              return diffInDays <= 2;
            }
          )

          .test(
            "date-out-not-equal-if-different",
            "Date Out must be after Date In if they are not the same",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true;

              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));

              if (dateIn.getTime() === dateOut.getTime()) return true;

              return dateOut > dateIn;
            }
          ),

        timeIn: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        oT: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        timeOut: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          )
          .test(
            "time-out-after-time-in-if-same-date",
            " Date In and Date Out are same, Time Out must be after Time In",
            function(value) {
              const { timeIn, attDateIn, attDateOut } = this.parent;
              if (!value || !timeIn || !attDateIn || !attDateOut) return true;

              // Convert dates to string for comparison
              const dateIn = formatDates(attDateIn, "yyyy-MM-dd");
              const dateOut = formatDates(attDateOut, "yyyy-MM-dd");

              if (dateIn !== dateOut) return true; // Only apply this test if dates are same

              // Convert HHMM strings to minutes
              const timeInMinutes =
                parseInt(timeIn.substring(0, 2)) * 60 +
                parseInt(timeIn.substring(2, 4));
              const timeOutMinutes =
                parseInt(value.substring(0, 2)) * 60 +
                parseInt(value.substring(2, 4));

              return timeOutMinutes >= timeInMinutes;
            }
          ),
        request_remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    } else {
      return Yup.object().shape({
        attDateIn: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required),
        attDateOut: Yup.date()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("attDateIn"), "Date Out cannot be before Date in date")
          .test(
            "max-3-days",
            "Date Out cannot be more than 3 days after Date In",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true; // If either value is missing, let other validations handle it
              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));
              const diffInDays = (dateOut - dateIn) / (1000 * 60 * 60 * 24);
              return diffInDays <= 2;
            }
          ),
        timeIn: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        timeOut: Yup.string()
          .nullable()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        request_remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    }
  }, [payrollData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        key={user?.Id} 
        initialValues={{
          ...user,
          request_remarks: "", 
          attDate: user?.attDate ? new Date(user.attDate) : null,
          attDateIn: user?.attDateIn || user?.attDate,
          // &&
          // !isNaN(new Date(user.attDateIn)) &&
          // new Date(user.attDateIn).toISOString().startsWith("1970-01-01")
          //   ? user?.attDate
          //     ? new Date(user.attDate)
          //     : ""
          //   : user?.attDateIn
          //   ? new Date(user.attDateIn)
          //   : ""
          attDateOut: user?.attDateOut || user?.attDate,
          // &&
          // !isNaN(new Date(user.attDateOut)) &&
          // new Date(user.attDateOut).toISOString().startsWith("1970-01-01")
          //   ? user?.attDate
          //     ? new Date(user.attDate)
          //     : ""
          //   : user?.attDateOut
          //   ? new Date(user.attDateOut)
          //   : "",
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          submitForm(values);
        }}
      >
        {({
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          handleReset,
          errors,
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset className="space-y-4">
                  {/* EmployeeProfile Starts */}
                  {/* <EmployeeProfile employeeId={employeeId} /> */}
                  {/* EmployeeProfile Ends */}

                  <div>
                    {/* Time Request Section */}
                    <h6 className="font-bold text-primary my-2">
                      Time Request
                    </h6>

                    {/* First Row */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Attendance Date */}
                      <div className="col-span-1">
                        <Field
                          name="attDate"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          onChange={(date) => setFieldValue("attDate", date)}
                          label={
                            <span>
                              Attendance Date{" "}
                              <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Worked Hours */}
                      <div className="col-span-1">
                        <Field
                          name="workedHours"
                          component={TimeInput}
                          className="form-control"
                          disabled
                          label={<span>Worked Hours</span>}
                          autoComplete="off"
                        />
                      </div>
                      {/* Attendance Status */}
                      <div className="col-span-1">
                        <Field
                          name="attendanceStatus"
                          component={Input}
                          className="form-control"
                          disabled
                          label={<span>Attendance Status</span>}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-3">
                      {/* Date In */}
                      <div>
                        <Field
                          name="attDateIn"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          onChange={(date) => setFieldValue("attDateIn", date)}
                          label={
                            <span>
                              Date In <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Time In */}
                      <div>
                        <Field
                          name="timeIn"
                          component={TimeInput}
                          label={
                            <span>
                              Time In <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>

                      {/* Date Out */}
                      <div>
                        <Field
                          name="attDateOut"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          label={
                            <span>
                              Date Out <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Time Out */}
                      <div>
                        <Field
                          name="timeOut"
                          component={TimeInput}
                          label={
                            <span>
                              Time Out <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* OT Hours */}
                      <div>
                        <Field
                          name="oT"
                          component={TimeInput}
                          label={
                            <span>
                              OT Hours <span className="text-red-500">*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Penalty Waive Off Section */}
                  <div className="mt-4">
                    <fieldset>
                      <h6 className="font-bold text-primary my-2">
                        Penalty Waive Off
                      </h6>

                      {/* Checkboxes */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            name="isLateComing"
                            type="checkbox"
                            onChange={() =>
                              setFieldValue(
                                "isLateComing",
                                !values?.isLateComing
                              )
                            }
                            onBlur={handleBlur}
                            checked={values.isLateComing}
                          />
                          Late Arrival
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            name="isEarlyGoing"
                            type="checkbox"
                            onChange={() =>
                              setFieldValue(
                                "isEarlyGoing",
                                !values?.isEarlyGoing
                              )
                            }
                            onBlur={handleBlur}
                            checked={values.isEarlyGoing}
                          />
                          Early Departure
                        </label>

                        <label className="flex items-center gap-2">
                          <input
                            name="isHalfDay"
                            type="checkbox"
                            onChange={() =>
                              setFieldValue("isHalfDay", !values?.isHalfDay)
                            }
                            onBlur={handleBlur}
                            checked={values.isHalfDay}
                          />
                          Half Day
                        </label>
                      </div>

                      {/* Reason Field */}
                      <div className="mt-3">
                        <Field
                          name="request_remarks"
                          component={TextArea}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <span>
                              Reason <span className="text-red-500">*</span>
                            </span>
                          }
                          value={values?.request_remarks}
                          autoComplete="off"
                        />
                      </div>
                    </fieldset>
                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  onHide();
                }}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
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
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
