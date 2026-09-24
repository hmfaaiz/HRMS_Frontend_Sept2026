import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { fetchAllProjects } from "../../../../Dashboard/_redux/dashboardActions";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { report, calendar } = useSelector((state) => {
    return {
      report: state?.auth?.userAccess["portal_ticket_time_report"],
      calendar: state?.auth?.userAccess["portal_ticket_calendar"],
    };
  }, shallowEqual);
  const formUIProps = useMemo(() => {
    return {
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
      employeeId: formUIContext.employeeId,
      setEmployeeId: formUIContext.setEmployeeId,
      queryParams: formUIContext.queryParams,
      Id: formUIContext.Id,
      setId: formUIContext.setId,
    };
  }, [formUIContext]);

  useEffect(() => {
    if (!formUIProps?.employeeId) return;
    dispatch(
      actions.fetchTimeLogs({
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps.queryParams?.filter,
          employeeId: formUIProps?.employeeId,
        },
      }),
    );
  }, [formUIProps?.employeeId]);

  useEffect(() => {
    if (!auth?.user?.employeeIdMapping) return;

    dispatch(fetchAllProjects(auth?.user?.employeeIdMapping));
    formUIProps.setEmployeeId(auth?.user?.employeeIdMapping);
  }, [auth?.user?.employeeIdMapping]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Ticket Creation",
                link: "/ticket_setup_portal/read-all-ticket-setup",
                isShow: auth?.userAccess?.["ticket_setup_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadTicketSetup" && el?.isAccess,
                ),
              },
              {
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: auth?.userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Project Timeline",
                link: "/project_timeline_portal/read-all-project-timeline",
                isShow: auth?.userAccess?.["project_timeline_portal"]?.find(
                  (el) =>
                    el?.componentName === "UpdateProjectTimeline" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Report",
                link: "/portal_ticket_time_report/read-all-project-report",
                isShow: report?.find(
                  (el) => el?.componentName === "ReadAllAssignmentReport",
                ),
              },
              {
                name: "Calendar",
                link: "/portal_ticket_calendar/read-ticket-calendar",
                isShow: calendar?.find(
                  (el) => el?.componentName === "ReadTicketCalendar",
                ),
              },
            ]}
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
            menuOptions={[
              {
                name: "Ticket Creation",
                link: "/ticket_setup_portal/read-all-ticket-setup",
                isShow: auth?.userAccess?.["ticket_setup_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadTicketSetup" && el?.isAccess,
                ),
              },
              {
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: auth?.userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Project Timeline",
                link: "/project_timeline_portal/read-all-project-timeline",
                isShow: auth?.userAccess?.["project_timeline_portal"]?.find(
                  (el) =>
                    el?.componentName === "UpdateProjectTimeline" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Report",
                link: "/portal_ticket_time_report/read-all-project-report",
                isShow: report?.find(
                  (el) => el?.componentName === "ReadAllAssignmentReport",
                ),
              },
              {
                name: "Calendar",
                link: "/portal_ticket_calendar/read-ticket-calendar",
                isShow: calendar?.find(
                  (el) => el?.componentName === "ReadTicketCalendar",
                ),
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          {formUIProps?.employeeId ? (
            <>
              <FormEditDialog Id={formUIProps?.Id} />
              <FormTable />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
