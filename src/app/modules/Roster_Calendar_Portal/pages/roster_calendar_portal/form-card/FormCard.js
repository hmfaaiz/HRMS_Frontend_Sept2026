import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Form, Modal } from "react-bootstrap";
import * as actions from "../../../_redux/redux-Actions";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
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
    .min(
      Yup.ref("from_date"),
      "'To Date' should not be less than 'From Date'.",
    ),
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
      actions.fetchRosters(
        { ...values, from_date: formattedFromDate, to_date: formattedToDate },
        setLoading,
      ),
    );
  };

  const { currentState, user, roster, rosterCalendarAccess } = useSelector(
    (state) => ({
      currentState: state?.roster_calendar_team,
      payrollData: state?.roster_calendar_team?.payrollData,
      user: state?.auth?.user,
      roster: state?.auth?.userAccess["Attendance Management"],
    }),
  );

  const { rosterCalendar, payrollData } = currentState;

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

  const menuOptions = [
    {
      name: "Request",
      link: "/attendance_roster_request/read-all-attendance-roster-request",
      isShow: roster?.find(
        (el) =>
          el?.componentName === "ReadAllAttendanceRosterRequest" &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Approval",
      link: "/attendance_roster_approval/read-all-attendance-roster-approval",
      isShow: roster?.find(
        (el) =>
          el?.componentName === "ReadAllAttendanceRosterApproval" &&
          el?.isResourceShow,
      ),
    },
    {
      name: "Workflow Status",
      link:
        "/attendance_roster_workflow_status_portal/read-all-attendance-roster-workflow-status-portal",
      isShow: roster?.find(
        (el) =>
          el?.componentName === "ReadAllAttendanceRosterWorkflowStatus" &&
          el?.isResourceShow,
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Left Column */}
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>

      {/* Right Column */}
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <Formik
            enableReinitialize={true}
            initialValues={{
              from_date: bodyValues?.from_date || null,
              to_date: bodyValues?.to_date || null,
            }}
            validationSchema={formValidation}
          >
            {({ setFieldValue, handleReset, values }) => (
              <>
                <Form className="form form-label-right">
                  <fieldset>
                    <h6>Filter Record</h6>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                      {/* From Date */}
                      <div className="col-span-1">
                        <label>
                          From <span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="From"
                          selected={
                            values?.from_date
                              ? new Date(values.from_date)
                              : null
                          }
                          onChange={(date) => {
                            setFieldValue("from_date", date);
                            setFieldValue("to_date", date);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="from_date"
                          autoComplete="off"
                        />
                      </div>

                      {/* To Date */}
                      <div className="col-span-1">
                        <label>
                          Date To <span style={{ color: "red" }}>*</span>
                        </label>
                        <DatePicker
                          className="form-control"
                          placeholder="To"
                          selected={
                            values?.to_date ? new Date(values.to_date) : null
                          }
                          onChange={(date) => setFieldValue("to_date", date)}
                          dateFormat="dd-MMM-yyyy"
                          name="to_date"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </fieldset>
                </Form>

                <Modal.Footer className="relative">
                  {/* Legend */}
                  <div className="text-xs absolute left-0 d-flex justify-content-center">
                    <div className="d-flex align-items-center m-3">
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          backgroundColor: "#3174ad",
                          display: "inline-block",
                          marginRight: 6,
                        }}
                      />
                      Shift Assigned
                    </div>
                    <div className="d-flex align-items-center m-3">
                      <span
                        className="tooltip-absent"
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          display: "inline-block",
                          marginRight: 6,
                        }}
                      />
                      Off Day
                    </div>
                  </div>

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
                    onClick={() => customSubmit(values)}
                    disabled={!values.from_date || !values.to_date}
                    className="btn btn-success"
                  >
                    Filter Record
                  </button>
                </Modal.Footer>
              </>
            )}
          </Formik>

          {rosterCalendar && rosterCalendar.length > 0 && <FormTable />}
        </div>
      </div>
    </div>
  );
}
