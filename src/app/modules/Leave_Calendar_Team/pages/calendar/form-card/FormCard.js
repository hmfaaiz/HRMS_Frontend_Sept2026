import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Modal } from "react-bootstrap";
import {
  CardBody,
  DatePickerField,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { format } from "date-fns";
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
      actions.fetchLeaves(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, user, payrollData } = useSelector((state) => {
    return {
      currentState: state?.team_leave_calender,
      payrollData: state?.team_leave_calender.payrollData,
      user: state?.auth?.user,
    };
  });

  const { leaveCalendar } = currentState;

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
            from_date: bodyValues?.from_date || null,
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
                        <h6>Leave Calendar</h6>
                        {/* Employee Selector */}
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

                <Modal.Footer>
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      dispatch(actions.clearEvents()); // Reset form and clear events
                    }}
                    className="btn btn-danger btn-elevate"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
                      customSubmit(values);
                    }}
                    disabled={!values.from_date || !values.to_date}
                    className="btn btn-success btn-elevate"
                  >
                    Filter Record
                  </button>
                </Modal.Footer>
              </>
            );
          }}
        </Formik>

        <CardBody>
          {leaveCalendar && leaveCalendar.length > 0 && <FormTable />}
        </CardBody>
      </Card>
    </>
  );
}
