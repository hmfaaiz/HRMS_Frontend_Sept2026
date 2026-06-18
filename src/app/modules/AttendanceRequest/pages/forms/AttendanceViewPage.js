import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider, useFormUIContext } from "./FormUIContext"; 
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { Route } from "react-router-dom";

import { WorkflowAuthortiesTable } from "./form-table/WorkflowAuthoritesTable";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import { useSelector, shallowEqual } from "react-redux";

import { AttendanceWorkflowModal } from "./form-table/AttendanceWorkflowModal"; 
import { LogsDialog } from "../../../../utils/common-modules/LogsDialog";

function AttendanceWorkflowModalWrapper() {
  const { workflowId, setWorkflowId } = useFormUIContext();
  if (!workflowId) return null;
  return (
    <AttendanceWorkflowModal
      show={!!workflowId}
      onHide={() => setWorkflowId(null)}
    />
  );
}

export function AttendanceViewPage({ history }) {
  const FormUIEvents = {
    newAttendanceRequest: (Id) => {
      return history.push(
        `/attendance_request/read-all-attendance-request/${Id}/new`
      );
    },

    viewttendanceLogs: (attDate) => {
      return history.push(
        `/attendance_request/read-all-attendance-request/${attDate}/logs`
      );
    },
  };
  const { attendance } = useSelector(
    (state) => ({
      attendance: state?.auth?.userAccess["Attendance"],
    }),
    shallowEqual
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/attendance_request/read-all-attendance-request/:Id/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/attendance_request/read-all-attendance-request");
            }}
          />
        )}
      </Route>

      <Route path="/attendance_request/read-all-attendance-request/:attDate/logs">
        {({ history, match, location }) => (
          <LogsDialog
            show={!!match}
    
            onHide={() => {
              history.push("/attendance_request/read-all-attendance-request");
            }}
          />
        )}
      </Route>
      {/* <Card>
        <CardHeader title={CurrentModuleName()}></CardHeader>
        <FormFilter />
        <FormTable />
        <AttendanceSummary />
        <WorkflowAuthortiesTable />
      </Card> */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name="Attendance Request"
              isBackButton={true}
              menuOptions={[
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
                {
                  name: "Attendance Calendar",
                  link: "/attendance_calendar_team/read-attendance-calendar",
                  isShow: attendance?.find(
                    (el) =>
                      el?.componentName === "ReadAttendanceCalendar" &&
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
              name="Attendance Request"
              isBackButton={true}
              menuOptions={[
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
                {
                  name: "Attendance Calendar",
                  link: "/attendance_calendar_team/read-attendance-calendar",
                  isShow: attendance?.find(
                    (el) =>
                      el?.componentName === "ReadAttendanceCalendar" &&
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
          <FormFilter />
          <FormTable />
          <WorkflowAuthortiesTable />
        </div>
      </div>
      <AttendanceWorkflowModalWrapper />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormUIProvider>
  );
}
