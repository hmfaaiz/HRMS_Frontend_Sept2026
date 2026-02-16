import React from "react";
import { Link } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

export const HelpDesk = () => {
  const { portal_ticket_creation ,auth} = useSelector(
    (state) => ({
      portal_ticket_creation: state?.auth?.userAccess.portal_ticket_creation,
      auth:state?.auth?.userAccess
    }),
    shallowEqual
  );

console.log("portal_ticket_creation111111",portal_ticket_creation)
  return (
    <>
      <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
        <h6 className="font-bold mb-0 text-primary my-2">
        Help Desk
        </h6>

        {portal_ticket_creation?.length > 0 ? (
          <div className="font-size-xs text-black font-bold">
            <p className="m-0 underline">
              <Link
                to={"/portal_ticket_creation/read-all-facilitator-ticket-creation"}
              >
               Task Assignment{" "}
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-sm mb-0">No Record</p>
        )}
      </div>
    </>
  );
};
