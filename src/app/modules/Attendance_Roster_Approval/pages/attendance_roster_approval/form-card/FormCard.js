import React, { useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { user, attendanceAccess, rosterCalendarAccess } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      attendanceAccess: state?.auth?.userAccess["Attendance Management"],
      rosterCalendarAccess: state?.auth?.userAccess["roster_calendar_team"],
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => ({
    queryParams:    FormUIContext?.queryParams,
    setQueryParams: FormUIContext?.setQueryParams,
    workflowId:     FormUIContext?.workflowId,
    setWorkflowId:  FormUIContext?.setWorkflowId,
  }));

  useEffect(() => {
    dispatch(
      actions.fetchRosterApprovalApplication(
        formUIProps?.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [formUIProps?.queryParams]);

  const menuOptions = [
    {
      name: "Request",
      link: "/attendance_roster_request/read-all-attendance-roster-request",
      isShow: attendanceAccess?.find(
        (el) =>
          el?.componentName === "ReadAllAttendanceRosterRequest" &&
          el?.isResourceShow
      ),
    },
    {
      name: "Workflow Status",
      link: "/attendance_roster_workflow_status_portal/read-all-attendance-roster-workflow-status-portal",
      isShow: attendanceAccess?.find(
        (el) =>
          el?.componentName === "ReadAllAttendanceRosterWorkflowStatus" &&
          el?.isResourceShow
      ),
    },
      {
      name: "Roster Calendar",
      link: "/roster_calendar_team/read-roster-calendar",
      isShow: rosterCalendarAccess?.find(
        (el) =>
          el?.componentName === "ReadRosterCalendar" &&
          el?.isResourceShow
      ),
    },
   
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div> */}

      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <FormApproval />
          <ApprovalFormTable />
        </div>

        {formUIProps.workflowId && (
          <WorkflowTable
            show={formUIProps.workflowId !== null}
            onHide={() => formUIProps.setWorkflowId(null)}
          />
        )}
      </div>
    </div>
  );
};