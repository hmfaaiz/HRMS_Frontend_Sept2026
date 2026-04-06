import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import TicketDetail from "../../../../../utils/common-modules/TicketDetail";
import { useFormUIContext } from "../FormUIContext";
import { CommentSection } from "../comment-section/CommentSection";
import { useHistory } from "react-router-dom";
import { fetchAllTicket } from "../../../../Dashboard/_redux/dashboardActions";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
export function FormCard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const { report, calendar } = useSelector((state) => {
    return {
      report: state?.auth?.userAccess["portal_ticket_time_report"],
      calendar: state?.auth?.userAccess["portal_ticket_calendar"],
    };
  }, shallowEqual);
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      setCommentsFilter: formUIContext.setCommentsFilter,
      commentsFilter: formUIContext.commentsFilter,
      panelMode: formUIContext.panelMode,
    };
  }, [formUIContext]);

  useEffect(() => {
    const queryParams = Object?.fromEntries(
      new URLSearchParams(history?.location?.search)?.entries(),
    );

    if (queryParams && Object.keys(queryParams).length > 0) {
      // Set filter from query params
      formUIProps.setCommentsFilter({
        ...formUIProps.commentsFilter,
        ...queryParams,
      });
      if (queryParams?.projectId)
        dispatch(fetchAllTicket(null, queryParams?.projectId));

      // Clear query params from URL
      history.replace({
        pathname: history.location.pathname,
        search: "", // Empty search params
        state: history.location.state,
      });
    }
  }, [history]);
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
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
                  name: "Time Logging",
                  link: "/time_logging_portal/read-all-time-log",
                  isShow: auth?.userAccess?.["time_logging_portal"]?.find(
                    (el) => el?.componentName === "ReadTimeLog" && el?.isAccess,
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
        </div>
        <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
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
                  name: "Time Logging",
                  link: "/time_logging_portal/read-all-time-log",
                  isShow: auth?.userAccess?.["time_logging_portal"]?.find(
                    (el) => el?.componentName === "ReadTimeLog" && el?.isAccess,
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
          <div className="w-full overflow-x-auto h-auto min-h-32 px-3 py-2 rounded-lg bg-white">
            <FormFilter />
            <br />
            {formUIProps?.panelMode && (
              <TicketDetail
                ticketId={formUIProps?.commentsFilter?.ticketId}
                panelMode={formUIProps?.panelMode}
              />
            )}
          </div>
          <CommentSection />
          <FormTable />
        </div>
      </div>
    </>
  );
}
