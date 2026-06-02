import React, { useMemo, useEffect } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormTable } from "../form-table/RosterRequestTable";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowTable";
import {
  fetchAllEmployeeShifts,
  fetchAllRosterPattern,
} from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeHierarchy} from "../../../../Dashboard/_redux/dashboardActions"
import { RosterWorkflowStatusModal } from "../form-table/RosterWorkflowStatusModal";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const { employeeList, roster,rosterCalendarAccess } = useSelector(
    (state) => ({
       employeeList: state?.dashboard?.employeeList ,
       roster: state?.auth?.userAccess["Attendance Management"],
       rosterCalendarAccess: state?.auth?.userAccess["roster_calendar_team"],
       }),
    shallowEqual
  );

  const FormUIProps = useMemo(() => ({
    employeeId:    FormUIContext.employeeId,
    setemployeeId: FormUIContext.setemployeeId,
    queryParams:   FormUIContext.queryParams,
    id:            FormUIContext.ids,
    workflowId:    FormUIContext.workflowId,    // ✅ ADD
    setWorkflowId: FormUIContext.setWorkflowId,
  }), [FormUIContext]);

  //Fetch dropdowns once on mount 
  useEffect(() => {
    dispatch(fetchAllEmployeeShifts("allEmployeeShifts"));
    dispatch(fetchAllRosterPattern("allRosterPatternList"));
    dispatch(getEmployeeHierarchy(1));
  }, []);

  //Auto-select first employee from global dashboard list 
  useEffect(() => {
    if (!FormUIProps.employeeId && employeeList?.length > 0) {
      FormUIProps.setemployeeId(employeeList[0].value);
    }
  }, [employeeList]);

  //Fetch roster requests when employeeId changes 
  useEffect(() => {
    if (FormUIProps.employeeId) {
      dispatch(
        actions.fetchAllRosterRequests({
          ...FormUIProps.queryParams,
          employeeId: FormUIProps.employeeId,
        })
      );
    }
  }, [FormUIProps.employeeId, FormUIProps.queryParams]);

  //Fetch workflow authorities when employeeId changes
  useEffect(() => {
    if (FormUIProps.employeeId) {
      dispatch(actions.getEmployeeAuthorities(FormUIProps.employeeId));
    }
  }, [FormUIProps.employeeId]);
  const menuOptions = [
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
    {
      name: "Roster Calendar",
      link: "/roster_calendar_team/read-roster-calendar",
      isShow: rosterCalendarAccess?.find(
        (el) =>
          el?.componentName === "ReadRosterCalendar" && el?.isResourceShow,
      ),
    },
  ];


  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu name={CurrentModuleName()} 
          isBackButton={true}
          menuOptions={menuOptions}
          isDashboardIcon={true} />
        </div>
        <EmployeeProfile />
      </div>

      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu name={CurrentModuleName()} 
          isBackButton={true} 
          menuOptions={menuOptions}
          isDashboardIcon={true} />
        </div>
        <FormEditDialog
          id={FormUIProps.id}
          employeeId={FormUIProps.employeeId}
        />
        <FormTable />
        <WorkflowAuthortiesTable />
      </div>
      {FormUIProps.workflowId && (
        <RosterWorkflowStatusModal
          show={!!FormUIProps.workflowId}
          onHide={() => FormUIProps.setWorkflowId(null)}
        />
      )}
    </div>
  );
}