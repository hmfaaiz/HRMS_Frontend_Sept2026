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
  fetchAllSubsidiaryData,
  getActiveFiscalYear,
} from "../../../../../../_metronic/redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

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
      actions.fetchHolidays(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading
      )
    );
  };

  const { currentState, user, activeFiscalYear } = useSelector((state) => {
    return {
      currentState: state?.portal_holiday_calendar,
      user: state?.auth?.user,
      activeFiscalYear: state?.dashboard?.activeFiscalYear,
    };
  });

  useEffect(() => {
    if (activeFiscalYear) {
      const [startDate, endDate] = activeFiscalYear?.payrollMonthLabel
        .match(/\((.*?)\)/)[1]
        .split(" - ")
        .map((d) => d);
      setBodyValues({
        from_date: startDate || "",
        to_date: endDate || "",
        subsidiaryId: user?.EmployeeMapping?.subsidiaryId,
      });
      setIsDataLoaded(true);
    }
  }, [activeFiscalYear]);

  const { holidayCalendar } = currentState;

  useEffect(() => {
    if (user?.EmployeeMapping) {
      dispatch(
        getActiveFiscalYear(
          "activeFiscalYear",
          user?.EmployeeMapping?.subsidiaryId
        )
      );
    }
  }, [user?.EmployeeMapping]);

  useEffect(() => {
    // Automatically submit when data is loaded
    if (isDataLoaded && user?.EmployeeMapping?.subsidiaryId) {
      customSubmit(bodyValues);
    }
  }, [isDataLoaded, bodyValues]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="lg:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/attendance_request/read-all-attendance-request",
              },
              {
                name: "Approval",
                link: "/attendance_approval/read-all-attendance-approval",
              },
              {
                name: "Workflow Status",
                link:
                  "/attendance-workflow-status/read-all-attendance-workflow-status",
              },
              {
                name: "Attendance Calendar",
                link: "/attendance_calendar_team/read-attendance-calendar",
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden lg:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/attendance_request/read-all-attendance-request",
              },
              {
                name: "Approval",
                link: "/attendance_approval/read-all-attendance-approval",
              },
              {
                name: "Workflow Status",
                link:
                  "/attendance-workflow-status/read-all-attendance-workflow-status",
              },
              {
                name: "Attendance Calendar",
                link: "/attendance_calendar_team/read-attendance-calendar",
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <Formik
            enableReinitialize={true}
            initialValues={{
              from_date: bodyValues?.from_date,
              to_date: bodyValues?.to_date,
              subsidiaryId: bodyValues?.subsidiaryId,
            }}
            validationSchema={formValidation}
            onSubmit={(values) => {
              customSubmit(values);
            }}
          >
            {({ setFieldValue, handleReset, values }) => (
              <>
                <Form className="form form-label-right">
                  <fieldset>
                    <h6>Filter Record</h6>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                      <div className="col-span-1">
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
                      <div className="col-span-1">
                        <label>
                          Date To<span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="To Date "
                          selected={
                            values?.to_date ? new Date(values.to_date) : null
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
                  </fieldset>
                </Form>
                <Modal.Footer>
                  <button
                    type="button"
                    onClick={() => {
                      handleReset();
                      dispatch(actions.clearEvents());
                    }}
                    className="btn btn-light"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      customSubmit(values);
                    }}
                    disabled={!values.from_date || !values.to_date}
                    className="btn btn-success"
                  >
                    Filter Record
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </Modal.Footer>
              </>
            )}
          </Formik>

          {holidayCalendar && holidayCalendar.length > 0 && <FormTable />}
        </div>
      </div>
    </div>
  );
}
