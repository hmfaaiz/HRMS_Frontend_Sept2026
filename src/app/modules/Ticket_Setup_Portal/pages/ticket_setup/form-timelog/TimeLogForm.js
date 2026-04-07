import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useSelector } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import DatePicker from "react-datepicker";
import { timeLoggingVal } from "../FormUIHelpers";

const formSchema = Yup.object().shape({
  timeRangeFrom: Yup.string().when("timeRangeTo", {
    is: (value) => value !== null && value !== "",
    then: Yup.string().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.string().notRequired(),
  }),

  timeRangeTo: Yup.string().when("timeRangeFrom", {
    is: (value) => value !== null && value !== "",
    then: Yup.string().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.string().notRequired(),
  }),

  noOfHours: Yup.number()

    .nullable()
    .required(VALIDATION_MESSAGES.required),

  timeRangeFrom: Yup.string().test(
    "from-required-if-to",
    VALIDATION_MESSAGES.required,
    function(value) {
      const { timeRangeTo } = this.parent;
      if (timeRangeTo && !value) {
        return false;
      }
      return true;
    },
  ),

  timeRangeTo: Yup.string().test(
    "to-required-if-from",
    VALIDATION_MESSAGES.required,
    function(value) {
      const { timeRangeFrom } = this.parent;
      if (timeRangeFrom && !value) {
        return false;
      }
      return true;
    },
  ),

  workDescription: Yup.string()
    .trim()
    .nullable(),
  // .required(VALIDATION_MESSAGES.required),
});

export function TimeLogForm({ ticketId, saveForm }) {
  const { employeeId } = useSelector((state) => {
    return {
      employeeId: state?.auth?.user?.employeeIdMapping,
    };
  }, shallowEqual);

  const calculateHours = (fromTime, toTime) => {
    if (!fromTime || !toTime) return 0;

    // "13:45" → total minutes
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const fromMinutes = parseTime(fromTime);
    const toMinutes = parseTime(toTime);

    let diffMinutes = toMinutes - fromMinutes;

    //  JIRA concept: next day consider
    if (diffMinutes <= 0) {
      diffMinutes += 24 * 60;
    }

    return diffMinutes / 60;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...timeLoggingVal,
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        saveForm({ ...values, employeeId, ticketId });
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  <div className="">
                    <label>
                      {" "}
                      Logged Date<span style={{ color: "red" }}>*</span>
                    </label>
                    <DatePicker
                      className="form-control"
                      placeholder="Logged Date"
                      selected={
                        values?.loggedDate
                          ? new Date(values.loggedDate)
                          : new Date()
                      }
                      onChange={(date) => {
                        setFieldValue("loggedDate", date);
                      }}
                      dateFormat="dd-MMM-yyyy"
                      name="loggedDate"
                      autoComplete="off"
                      maxDate={new Date()}
                    />

                    {touched.loggedDate && errors.loggedDate && (
                      <div className="invalid-feedback d-block">
                        {errors.loggedDate}
                      </div>
                    )}
                  </div>

                  <div>
                    <label>
                      <span>From Time</span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      // disabled={!values.initiator}
                      name="timeRangeFrom"
                      step="60" //  minutes only (no seconds)
                      value={values.timeRangeFrom || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("timeRangeFrom", val);

                        const hours = calculateHours(val, values.timeRangeTo);
                        setFieldValue("noOfHours", hours.toFixed(2));
                      }}
                    />
                  </div>
                  <div>
                    <label>
                      <span>To Time</span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      // disabled={!values.initiator}
                      name="timeRangeTo"
                      step="60"
                      value={values.timeRangeTo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFieldValue("timeRangeTo", val);

                        const hours = calculateHours(values.timeRangeFrom, val);
                        setFieldValue("noOfHours", hours.toFixed(2));
                      }}
                    />
                  </div>

                  <div className="">
                    <label>
                      <span>
                        No.of Hours
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>

                    <Field
                      name="noOfHours"
                      component={Input}
                      placeholder="Enter no of hours"
                      type="number"
                      disabled={values.timeRangeFrom || values.timeRangeTo}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-x-3 gap-y-10">
                  <div className="col-span-8">
                    <Field
                      name="workDescription"
                      component={TextArea}
                      placeholder="Enter ticket description"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Work Description
                          {/* <span style={{ color: "red" }}>*</span> */}
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div></div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1 mt-3">
                    <Field
                      name={`isBillable`}
                      component={Checkbox}
                      onChange={(e) => {
                        setFieldValue(`isBillable`, e.target.checked);
                      }}
                      isSelected={values.isBillable}
                      children={"Biillable"}
                    />
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={() => {
                handleSubmit();
              }}
              className="btn btn-primary btn-elevate"
            >
              Save
            </button>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
