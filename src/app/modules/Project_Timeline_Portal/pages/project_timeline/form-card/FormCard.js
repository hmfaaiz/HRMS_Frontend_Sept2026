import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useProjectTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { TicketType } from "../FormUIHelpers";
import { fetchProjectTimeline } from "../../../_redux/redux-Actions";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

export function FormCard() {
  const uiContext = useProjectTimelineUIContext();
  const dispatch = useDispatch();

  const {
    projects,
    ticketTypes,
    ticketStatuses,
    listLoading,
    auth,
  } = useSelector(
    (state) => ({
      projects: state.dashboard?.allProjects || [],
      // ticketTypes: state.dashboard?.allTicket || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      listLoading: state.project_timeline_portal?.listLoading,
      pdfLoading: state.project_timeline_portal?.pdfLoading,
      csvLoading: state.project_timeline_portal?.csvLoading,
      excelLoading: state.project_timeline_portal?.excelLoading,
      auth: state?.auth,
    }),
    shallowEqual,
  );

  const print = async (type) => {
    let updatedQueryParams = {
      ...uiContext.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [type]: true,
    };

    await dispatch(fetchProjectTimeline(updatedQueryParams));

    // reset flags
    uiContext.setQueryParams({
      ...uiContext.queryParams,
      csv: false,
      excel: false,
      pdf: false,
    });
  };

  useEffect(() => {
    dispatch(actions.fetchAllTicketStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!auth?.user?.employeeIdMapping) return;

    dispatch(actions.fetchAllProjects(auth?.user?.employeeIdMapping));
  }, [auth?.user?.employeeIdMapping]);

  return (
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
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: auth?.userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
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
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: auth?.userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
                ),
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <FormFilter
            loading={listLoading}
            projects={projects}
            ticketTypes={TicketType}
            ticketStatuses={ticketStatuses}
            onPrint={print}
          />
          <FormTable ticketStatuses={ticketStatuses} ticketTypes={TicketType} />{" "}
        </div>
      </div>
    </div>
  );
}
