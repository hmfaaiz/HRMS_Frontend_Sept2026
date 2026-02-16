import React from "react";
import { useSelector, shallowEqual } from "react-redux";

export const ProjectManagement = () => {
  const { ticket_setup_portal } = useSelector(
    (state) => ({
      ticket_setup_portal: state?.auth?.userAccess["ticket_setup_portal"],
    }),
    shallowEqual,
  );

  const isTicketCreation = ticket_setup_portal?.find(
    (el) => el?.componentName === "ReadTicketSetup" && el?.portalType == 2,
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
      </div>
    </>
  );
};
