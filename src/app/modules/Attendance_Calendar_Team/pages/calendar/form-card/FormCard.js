import React, { useEffect, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import {
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";

import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";

const formValidation = Yup.object().shape({
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "Date to date cannot be before Date from date"),
});

export function FormCard() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [bodyValues, setBodyValues] = useState();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const customSubmit = (values) => {
    let formattedFromDate = formatDates(values?.from_date, "yyyy-MM-dd");
    let formattedToDate = formatDates(values?.to_date, "yyyy-MM-dd");

    dispatch(
      actions.fetchAttendances(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, payrollData, user } = useSelector((state) => {
    return {
      currentState: state?.attendance_calendar_team,
      payrollData: state?.attendance_calendar_team.payrollData,
      user: state?.auth?.user,
    };
  });

  const { attendanceCalendar } = currentState;

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
  }, [user]);

  useEffect(() => {
    if (payrollData) {
      setBodyValues({
        from_date: payrollData?.startDate || "",
        to_date: payrollData?.endDate || "",
      });
      setIsDataLoaded(true);
    }
  }, [payrollData]);

  useEffect(() => {
    // Automatically submit when data is loaded
    if (isDataLoaded) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);

  return (
    <>
      <Card>
        <CardHeader title={CurrentModuleName()}></CardHeader>
        <Formik
          enableReinitialize={true}
          initialValues={{
            from_date: bodyValues?.from_date || new Date(),
            to_date: bodyValues?.to_date || null,
          }}
          validationSchema={formValidation}
        >
          {({ setFieldValue, handleReset, values }) => {
            return (
              <>
                <Modal.Body className="overlay overlay-block cursor-default">
                  <Form className="form form-label-right">
                    <fieldset>
                      <div
                        style={{
                          backgroundColor: "rgb(235 243 255)",
                          marginTop: "15px",
                          padding: "20px",
                          borderRadius: "5px",
                          border: "2px solid #adceff",
                        }}
                      >
                        <h6>Attendance Calendar</h6>
                        <div className="form-group row">
                          <div className="col-12 col-md-4 mt-3">
                            <label>
                              From Date<span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                              className="form-control"
                              placeholder="From Date "
                              selected={
                                values?.from_date
                                  ? new Date(values.from_date)
                                  : null
                              }
                              onChange={(date) => {
                                setFieldValue("from_date", date);
                                setFieldValue("to_date", date); // Sync from_date and to_date
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              // showTimeInput
                              name="from_date"
                              autoComplete="off"
                            />
                          </div>
                          {/* Date To Selector */}
                          <div className="col-12 col-md-4 mt-3">
                            <label>
                              Date To<span style={{ color: "red" }}>*</span>
                            </label>
                            <DatePicker
                              className="form-control"
                              placeholder="To Date "
                              selected={
                                values?.to_date
                                  ? new Date(values.to_date)
                                  : null
                              }
                              onChange={(date) => {
                                setFieldValue("to_date", date);
                              }}
                              timeInputLabel="Time:"
                              dateFormat="dd-MMM-yyyy"
                              // showTimeInput
                              name="to_date"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </Form>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                  <div className="d-flex justify-content-center ">
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_25 me-2"></span>{" "}
                      Present
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_15 me-2"></span>{" "}
                      Absent
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_16 me-2"></span> Half
                      day
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_1 me-2"></span> Leave
                    </div>

                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_22 me-2"></span> Day
                      Off / Holiday
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span className="dot bg_custom_color_26 me-2"></span> Late
                      In / Early Out
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        handleReset();
                        dispatch(actions.clearEvents()); // Reset form and clear events
                      }}
                      className="btn btn-danger btn-elevate m-2"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
                        customSubmit(values);
                      }}
                      disabled={!values.from_date || !values.to_date}
                      className="btn btn-success btn-elevate m-2"
                    >
                      Filter Record
                    </button>
                  </div>
                </Modal.Footer>
              </>
            );
          }}
        </Formik>

        <CardBody>
          {attendanceCalendar && attendanceCalendar.length > 0 && <FormTable />}
        </CardBody>
      </Card>
    </>
  );
}
