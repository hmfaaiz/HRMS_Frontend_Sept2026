import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { Route } from "react-router-dom";

import { WorkflowAuthortiesTable } from "./form-table/WorkflowAuthoritesTable";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";

export function AttendanceViewPage({ history }) {
  const FormUIEvents = {
    newAttendanceRequest: (Id) => {
      return history.push(
        `/attendance_request/read-all-attendance-request/${Id}/new`
      );
    },
  };
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
      {/* <Card>
        <CardHeader title={CurrentModuleName()}></CardHeader>
        <FormFilter />
        <FormTable />
        <AttendanceSummary />
        <WorkflowAuthortiesTable />
      </Card> */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="lg:hidden block">
            <EmployeePortalMenu
              name="Attendance Request"
              isBackButton={true}
              menuOptions={[
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
                {
                  name: "Holiday Calendar",
                  link: "/holiday_calendar/my-holiday-calendar",
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
              name="Attendance Request"
              isBackButton={true}
              menuOptions={[
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
                {
                  name: "Holiday Calendar",
                  link: "/holiday_calendar/my-holiday-calendar",
                },
              ]}
              isDashboardIcon={true}
            />
          </div>
          <FormFilter />
          <FormTable />
          <WorkflowAuthortiesTable />
        </div>
      </div>

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
