import React from "react";
import { useSelector, shallowEqual } from "react-redux";

export const ProjectManagement = () => {
  const {
    ticket_setup_portal,
    time_logging_portal,
    Task,
    project_timeline_portal,
  } = useSelector(
    (state) => ({
      ticket_setup_portal: state?.auth?.userAccess["ticket_setup_portal"],
      Task: state?.auth?.userAccess["Task"],
      time_logging_portal: state?.auth?.userAccess["time_logging_portal"],
      project_timeline_portal:
        state?.auth?.userAccess["project_timeline_portal"],
    }),
    shallowEqual,
  );

  const isTicketCreation =
    Task?.find(
      (e) =>
        e.componentName == "ReadAllTicketSetup" &&
        e?.portalType == 2 &&
        e?.isResourceShow,
    ) &&
    ticket_setup_portal?.find(
      (el) => el?.componentName === "ReadTicketSetup" && el?.portalType == 2,
    );

  const isProjectTimeLog =
    Task?.find(
      (e) =>
        e.componentName == "ReadAllTimeLog" &&
        e?.portalType == 2 &&
        e?.isResourceShow,
    ) &&
    time_logging_portal?.find(
      (el) => el?.componentName === "ReadTimeLog" && el?.portalType == 2,
    );

  const isProjectTimeLine =
    Task?.find(
      (e) =>
        e.componentName == "ReadAllProjectTimeline" &&
        e?.portalType == 2 &&
        e?.isResourceShow,
    ) &&
    project_timeline_portal?.find(
      (el) =>
        el?.componentName === "UpdateProjectTimeline" && el?.portalType == 2,
    );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">Project Management</h6>
        {isTicketCreation ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a href={"/ticket_setup_portal/read-all-ticket-setup"}>
                Ticket Creation{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Ticket Creation</p>
        )}
        {isProjectTimeLog ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a href={"/time_logging_portal/read-all-time-log"}>
                Time Logging{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Time Logging</p>
        )}
        {/* {isProjectTimeLine ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <a href={"/project_timeline_portal/read-all-project-timeline"}>
                Project Timeline{" "}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">Project Timeline</p>
        )} */}
      </div>
    </>
  );
};
