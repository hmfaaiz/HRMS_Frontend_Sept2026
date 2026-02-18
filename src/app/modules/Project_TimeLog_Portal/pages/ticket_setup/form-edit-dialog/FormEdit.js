import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, useDispatch } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { formatDates } from "../../../../../utils/common";
import { fetchAllTicket } from "../../../../Dashboard/_redux/dashboardActions";

const formSchema = Yup.object()
  .shape({
    projectId: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    ticketId: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    loggedDate: Yup.date()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    workDescription: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    timeRangeFrom: Yup.string().nullable(),
    timeRangeTo: Yup.string().nullable(),
    noOfHours: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
  })
  .test("time-range-validation", function(value) {
    const { timeRangeFrom, timeRangeTo } = value;

    if (timeRangeFrom && !timeRangeTo) {
      return this.createError({
        path: "timeRangeTo",
        message: VALIDATION_MESSAGES.required,
      });
    }

    if (!timeRangeFrom && timeRangeTo) {
      return this.createError({
        path: "timeRangeFrom",
        message: VALIDATION_MESSAGES.required,
      });
    }

    return true;
  });
/* ---------------- COMPONENT ---------------- */
export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  initialValues,
  setId,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  /* -------- FETCH MASTER DATA -------- */

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

  useEffect(() => {
    if (!dataForEdit?.projectId) return;

    dispatch(fetchAllTicket(null, dataForEdit?.projectId));
  }, [dataForEdit]);
  /* ---------------- FORM ---------------- */
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...dataForEdit,
      }}
      validationSchema={formSchema}
      onSubmit={(values, { resetForm }) => {
        const payload = {
          ...values,
          loggedDate: values.loggedDate
            ? formatDates(values.loggedDate, "dd-MMM-yyyy")
            : null,
        };
        saveForm(payload, resetForm);
      }}
    >
      {({
        handleSubmit,
        values,
        setFieldValue,
        errors,
        touched,
        isValid,
        resetForm,
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
                <div className="grid grid-cols-3 gap-x-3 gap-y-1 w-full sm:w-2/4">
                  <div>
                    <SearchSelect
                      name="projectId"
                      label={
                        <span>
                          Project <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        dashboard?.allProjects?.find(
                          (el) => el?.value == values?.projectId,
                        ) || ""
                      }
                      options={dashboard.allProjects || []}
                      error={errors.projectId}
                      touched={touched.projectId}
                      onChange={async (e) => {
                        if (e?.value) {
                          setFieldValue("projectId", e.value);
                          setFieldValue("ticketId", "");
                          dispatch(fetchAllTicket(null, e?.value));
                        }
                      }}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="ticketId"
                      label={
                        <span>
                          Ticket <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={!values?.projectId}
                      value={
                        dashboard?.allTicket?.find(
                          (el) => el?.value == values?.ticketId,
                        ) || ""
                      }
                      options={dashboard.allTicket || []}
                      error={errors.ticketId}
                      touched={touched.ticketId}
                      onChange={async (e) => {
                        if (e?.value) {
                          setFieldValue("ticketId", e.value);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="loggedDate"
                      component={DatePickerField}
                      disabled={!values?.projectId}
                      dateFormat="dd-MMM-yyyy"
                      onChange={(date) => {
                        setFieldValue("loggedDate", date);
                      }}
                      label={
                        <span>
                          {" "}
                          Logged Date<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>
                  <div>
                    <label>
                      <span>
                        From Time <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      disabled={!values?.projectId}
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
                      <span>
                        To Time
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    </label>

                    <input
                      type="time"
                      className="form-control"
                      disabled={!values?.projectId}
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
                  <div>
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
                      disabled={
                        values.timeRangeFrom ||
                        values.timeRangeTo ||
                        !values?.projectId
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Field
                      name="workDescription"
                      component={TextArea}
                      placeholder="Enter ticket description"
                      className="form-control" // Force full height
                      label={
                        <span>
                          {" "}
                          Work Description
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                    <div></div>
                  </div>
                  <div className="mt-2">
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
              onClick={() => {
                resetForm(initialValues);
                setId("");
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isValid}
              className="btn btn-primary"
            >
              {values?.Id ? "Update" : "Save"}
              {actionsLoading && (
                <span className="ml-3 spinner spinner-white"></span>
              )}
            </button>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
