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
          .required(VALIDATION_MESSAGES.required)
          .min(
            payrollData.startDate,
            `Date cannot be before ${formatDates(payrollData.startDate)}`
          ),
        attDateOut: Yup.date()
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
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
          oT: Yup.string()
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
        attDateIn: Yup.date().required(VALIDATION_MESSAGES.required),
        attDateOut: Yup.date()
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
          ),
        request_remarks: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    }
  }, [payrollData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...user,
          attDate: user?.attDate ? new Date(user.attDate) : null,
          attDateIn:
            user?.attDateIn &&
            !isNaN(new Date(user.attDateIn)) &&
            new Date(user.attDateIn).toISOString().startsWith("1970-01-01")
              ? user?.attDate
                ? new Date(user.attDate)
                : ""
              : user?.attDateIn
              ? new Date(user.attDateIn)
              : "",
          attDateOut:
            user?.attDateOut &&
            !isNaN(new Date(user.attDateOut)) &&
            new Date(user.attDateOut).toISOString().startsWith("1970-01-01")
              ? user?.attDate
                ? new Date(user.attDate)
                : ""
              : user?.attDateOut
              ? new Date(user.attDateOut)
              : "",
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
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset>
                  {/* EmployeeProfile Starts */}
                  {/* <EmployeeProfile employeeId={employeeId} /> */}
                  {/* EmployeeProfile Ends */}
                  <div className="from-group row">
                    {payrollData &&
                      payrollData.startDate &&
                      payrollData.endDate && (
                        <div className="col-12 col-md-12">
                          <div className="row  justify-content-center">
                            <span className="mr-2">
                              <b>Active Payroll Month:</b>{" "}
                            </span>
                            <span>
                              <b>
                                <ActivePayrollMonthLabel
                                  className="date"
                                  month={payrollData.month}
                                  year={payrollData.year}
                                  startDate={payrollData.startDate}
                                  endDate={payrollData.endDate}
                                />
                              </b>
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      margin: "15px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <p className="font-weight-bold">Time Request</p>
                    <div className="from-group row">
                      {/* Date In Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="attDate"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          onChange={(date) => {
                            setFieldValue("attDate", date);
                          }}
                          label={
                            <span>
                              {" "}
                              Attendance Date{" "}
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Date In Field End */}
                    </div>
                    <div className="from-group row">
                      {/* Date In Field Start */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="attDateIn"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          onChange={(date) => {
                            setFieldValue("attDateIn", date);
                          }}
                          label={
                            <span>
                              {" "}
                              Date In<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Date In Field End */}

                      {/* Time In Field Start */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="timeIn"
                          component={TimeInput}
                          // maxlength="4"
                          label={
                            <span>
                              {" "}
                              Time In<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Time In Field End */}
                      {/* Date Out Field Start */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="attDateOut"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          label={
                            <span>
                              {" "}
                              Date Out<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Date Out Field End */}

                      {/* Time Out Field Start */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="timeOut"
                          component={TimeInput}
                          // maxlength="4"
                          label={
                            <span>
                              {" "}
                              Time Out<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* Time Out Field End */}
                    </div>
                    <div className="from-group row">
                      {/* OT Hours Field start  */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="oT"
                          component={TimeInput}
                          // maxlength="4"
                          label={
                            <span>
                              {" "}
                              OT Hours<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          autoComplete="off"
                        />
                      </div>
                      {/* OT Hours Field end  */}
                      {/* Worked Hours Field Start */}
                      <div className="col-12 col-md-3 mt-3">
                        <Field
                          name="workedHours"
                          component={TimeInput}
                          className="form-control"
                          disabled
                          label={<span> Worked Hours</span>}
                          autoComplete="off"
                        />
                      </div>
                      {/* Worked Hours Field End */}

                      {/* Attendance Status Field Start */}
                      <div className="col-12 col-md-6 mt-3">
                        <Field
                          name="attendanceStatus"
                          component={Input}
                          className="form-control"
                          disabled
                          label={<span> Attendance Status</span>}
                          autoComplete="off"
                        />
                      </div>
                      {/* Attendance Status Field End */}
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      margin: "15px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <fieldset>
                      <p className="font-weight-bold">Penalty Waive Off</p>
                      <div className="row">
                        <div className="col-12 col-md-4 mt-2">
                          <input
                            name="isLateComing"
                            type="checkbox"
                            onChange={(e) => {
                              setFieldValue(
                                "isLateComing",
                                !values?.isLateComing
                              );
                            }}
                            onBlur={handleBlur}
                            value={values.isLateComing}
                            checked={values.isLateComing}
                          />
                          <label className="px-2">Late Arrival</label>
                          <ErrorMessage
                            className="form-feedBack"
                            name="isLateComing"
                            component="div"
                          />
                        </div>
                        <div className="col-12 col-md-4 mt-2">
                          <input
                            name="isEarlyGoing"
                            type="checkbox"
                            onChange={(e) => {
                              setFieldValue(
                                "isEarlyGoing",
                                !values?.isEarlyGoing
                              );
                            }}
                            onBlur={handleBlur}
                            value={values.isEarlyGoing}
                            checked={values.isEarlyGoing}
                          />
                          <label className="px-2">Early Departure</label>
                          <ErrorMessage
                            className="form-feedBack"
                            name="isEarlyGoing"
                            component="div"
                          />
                        </div>
                        <div className="col-12 col-md-4 mt-2">
                          <input
                            name="isHalfDay"
                            type="checkbox"
                            onChange={(e) => {
                              setFieldValue("isHalfDay", !values?.isHalfDay);
                            }}
                            onBlur={handleBlur}
                            value={values.isHalfDay}
                            checked={values.isHalfDay}
                          />
                          <label className="px-2">Half Day</label>
                          <ErrorMessage
                            className="form-feedBack"
                            name="isHalfDay"
                            component="div"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div
                    style={{
                      backgroundColor: "rgb(235 243 255)",
                      margin: "15px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "2px solid #adceff",
                    }}
                  >
                    <div className="from-group row">
                      {/* Comments Field Start */}
                      <div className="col-12 col-md-9 mt-3">
                        <Field
                          name="request_remarks"
                          component={TextArea}
                          placeholder=""
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <span>
                              {" "}
                              Reason<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values?.request_remarks}
                          autoComplete="off"
                        />
                      </div>
                      {/* Comments Field End */}
                    </div>
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
