import React, { useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { FormTable } from "../form-table/FormTable";
import { FormFilter } from "../form-filter/FormFilter";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function FormCard() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const formUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const {
    ticket_setup_portal,
    pdfLoading,
    csvLoading,
    excelLoading,
    userAccess,
    report,
    calendar,
  } = useSelector(
    (state) => ({
      ticket_setup_portal: state.auth.userAccess.ticket_setup_portal,
      userAccess: state.auth.userAccess,
      pdfLoading: state?.ticket_setup_portal?.pdfLoading,
      csvLoading: state?.ticket_setup_portal?.csvLoading,
      excelLoading: state?.ticket_setup_portal?.excelLoading,
      report: state?.auth?.userAccess["portal_ticket_time_report"],
      calendar: state?.auth?.userAccess["portal_ticket_calendar"],
    }),
    shallowEqual,
  );

  const accessUser = ticket_setup_portal?.find(
    (item) => item.componentName === "CreateTicketSetup",
  );

  const print = async (value) => {
    // Create updated query params with the export flag
    let updatedQueryParams = {
      ...formUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
      [value]: true,
    };

    await dispatch(actions.fetchTickets(updatedQueryParams));

    // Reset the export flags after download completes
    updatedQueryParams = {
      ...formUIProps.queryParams,
      csv: false,
      excel: false,
      pdf: false,
    };

    formUIProps.setQueryParams(updatedQueryParams);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Time Logging",
                link: "/time_logging_portal/read-all-time-log",
                isShow: userAccess?.["time_logging_portal"]?.find(
                  (el) => el?.componentName === "ReadTimeLog" && el?.isAccess,
                ),
              },
              {
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Project Timeline",
                link: "/project_timeline_portal/read-all-project-timeline",
                isShow: userAccess?.["project_timeline_portal"]?.find(
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
      {/* <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4"> */}
      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Time Logging",
                link: "/time_logging_portal/read-all-time-log",
                isShow: userAccess?.["time_logging_portal"]?.find(
                  (el) => el?.componentName === "ReadTimeLog" && el?.isAccess,
                ),
              },
              {
                name: "Ticket Activity",
                link: "/ticket_activity_portal/read-ticket-activity",
                isShow: userAccess?.["ticket_activity_portal"]?.find(
                  (el) =>
                    el?.componentName === "ReadAllTicketComments" &&
                    el?.isAccess,
                ),
              },
              {
                name: "Project Timeline",
                link: "/project_timeline_portal/read-all-project-timeline",
                isShow: userAccess?.["project_timeline_portal"]?.find(
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
          <div className="mb-3">
            <FormFilter
              accessUser={accessUser}
              newButtonClick={() => {
                formUIProps.newButtonClick();
              }}
              exportButtons={
                <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tickets-pdf-tooltip">Export PDF</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      disabled={pdfLoading}
                      onClick={() => {
                        print("pdf");
                      }}
                    >
                      <FileText className="w-4 h-4 text-black cursor-pointer" />
                    </button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tickets-csv-tooltip">Export CSV</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      disabled={csvLoading}
                      onClick={() => {
                        print("csv");
                      }}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-black cursor-pointer" />
                    </button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tickets-excel-tooltip">Export Excel</Tooltip>
                    }
                  >
                    <button
                      type="button"
                      className="border-none bg-transparent"
                      disabled={excelLoading}
                      onClick={() => {
                        print("excel");
                      }}
                    >
                      <Sheet className="w-4 h-4 text-black cursor-pointer" />
                    </button>
                  </OverlayTrigger>
                </div>
              }
            />
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  display: "inline-block",
                }}
              ></span>
              <span className="text-xs">High</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "orange",
                  display: "inline-block",
                }}
              ></span>
              <span className="text-xs">Medium</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  display: "inline-block",
                }}
              ></span>
              <span className="text-xs">Low</span>
            </div>
          </div>
          <FormTable />
        </div>
      </div>
    </div>
  );
}
