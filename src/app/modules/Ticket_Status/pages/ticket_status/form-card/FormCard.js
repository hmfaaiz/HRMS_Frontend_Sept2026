import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";

import TCard from "../../../../../utils/common-modules/TCard";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

import { TicketStatusTable } from "../form-table/FormTable";
import { TicketStatusFilter } from "../form-filter/FormFilter";
import { useTicketStatusUIContext } from "../FormUIContext";

export function TicketStatusCard() {
  const ticketStatusUIContext = useTicketStatusUIContext();

  const ticketStatusUIProps = useMemo(() => {
    return {
      newTicketStatusButtonClick: ticketStatusUIContext.newTicketStatusButtonClick,
    };
  }, [ticketStatusUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess?.ticket_status,
    }),
    shallowEqual
  );

  // Check if user has access to create ticket status
  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateTicketStatus"
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
        {/* Filter Component */}
        <TicketStatusFilter />

        {/* Add Button */}
        {accessUser && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={ticketStatusUIProps.newTicketStatusButtonClick}
          >
            <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
            Add
          </button>
        )}
      </div>

      {/* Table Component */}
      <TicketStatusTable />
    </TCard>
  );
}
