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
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

const formValidation = Yup.object().shape({
  from_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required),
  to_date: Yup.date()
    .typeError("Please select the date")
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from_date"), "'To Date' should not be less than 'From Date'."),
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

  const { currentState, payrollData, user, attendance } = useSelector(
    (state) => {
      return {
        currentState: state?.attendance_calendar_team,
        payrollData: state?.attendance_calendar_team.payrollData,
        user: state?.auth?.user,
        attendance: state?.auth?.userAccess["Attendance"],
      };
    }
  );

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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/attendance_request/read-all-attendance-request",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceRequest" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Approval",
                link: "/attendance_approval/read-all-attendance-approval",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/attendance-workflow-status/read-all-attendance-workflow-status",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
              // {
              //   name: "Holiday Calendar",
              //   link: "/holiday_calendar/my-holiday-calendar",
              //   isShow: attendance?.find(
              //     (el) =>
              //       el?.componentName === "MyHolidayCalendar" &&
              //       el?.isResourceShow
              //   ),
              // },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/attendance_request/read-all-attendance-request",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceRequest" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Approval",
                link: "/attendance_approval/read-all-attendance-approval",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/attendance-workflow-status/read-all-attendance-workflow-status",
                isShow: attendance?.find(
                  (el) =>
                    el?.componentName === "ReadAllAttendanceWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
              // {
              //   name: "Holiday Calendar",
              //   link: "/holiday_calendar/my-holiday-calendar",
              //   isShow: attendance?.find(
              //     (el) =>
              //       el?.componentName === "MyHolidayCalendar" &&
              //       el?.isResourceShow
              //   ),
              // },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
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
                  <Form className="form form-label-right">
                    <fieldset>
                      <h6>Attendance Calendar</h6>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        <div className="col-span-1">
                          <label>
                            From
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <DatePicker
                            className="form-control"
                            placeholder="From "
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
                            placeholder="To "
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
                        <div className=" col-span-2 text-xs sm:col-span-4 lg:col-span-6 d-flex justify-content-center ">
                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_25 me-2"></span>{" "}
                            Present
                          </div>
                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_15 me-2"></span>{" "}
                            Absent
                          </div>
                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_16 me-2"></span>{" "}
                            Half day
                          </div>
                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_1 me-2"></span>{" "}
                            Leave
                          </div>

                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_22 me-2"></span>{" "}
                            Day Off / Holiday
                          </div>
                          <div className="d-flex align-items-center m-3">
                            <span className="dot bg_custom_color_26 me-2"></span>{" "}
                            Late In / Early Out
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </Form>

                  <Modal.Footer>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          handleReset();
                          dispatch(actions.clearEvents()); // Reset form and clear events
                        }}
                        className="btn btn-light m-2"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          // customSubmit({ ...values, from_date: formattedFromDate, to_date: formattedToDate });
                          customSubmit(values);
                        }}
                        disabled={!values.from_date || !values.to_date}
                        className="btn btn-success"
                      >
                        Filter Record
                      </button>
                    </div>
                  </Modal.Footer>
                </>
              );
            }}
          </Formik>
          {attendanceCalendar && attendanceCalendar.length > 0 && <FormTable />}
        </div>
      </div>
    </div>
  );
}
