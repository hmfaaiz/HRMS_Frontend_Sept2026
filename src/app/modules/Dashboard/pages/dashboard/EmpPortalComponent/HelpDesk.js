import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const HelpDesk = () => {
  const {
    portal_ticket_creation,
    auth,
    portal_task_assignment_timeline,
  } = useSelector(
    (state) => ({
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
      portal_task_assignment_timeline:
        state?.auth?.userAccess.portal_task_assignment_timeline,
      auth: state?.auth?.userAccess,
    }),
    shallowEqual,
  );

  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">Task Assignment</h6>

        {portal_ticket_creation?.length > 0 ||
        portal_task_assignment_timeline?.length > 0 ? (
          <>
            {portal_ticket_creation?.length > 0 && (
              <div className="font-size-xs text-black font-bold">
                <p className="m-0 underline">
                  <Link to="/portal_ticket_creation/read-all-facilitator-ticket-creation">
                    Task Assignment
                  </Link>
                </p>
              </div>
            )}

            {portal_task_assignment_timeline?.length > 0 && (
              <div className="font-size-xs text-black font-bold">
                <p className="m-0 underline">
                  <Link to="/portal_task_assignment_timeline/read-all-task-assignment-timeline">
                    Task Assignment Timeline
                  </Link>
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm mb-0">No Record</p>
        )}
      </div>
    </>
  );
};
