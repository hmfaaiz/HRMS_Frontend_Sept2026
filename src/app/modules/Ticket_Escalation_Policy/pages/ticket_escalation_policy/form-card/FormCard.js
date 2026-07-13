import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { CirclePlus } from "lucide-react";
import { useTicketEscalationPolicyUIContext } from "../FormUIContext";
import { TicketEscalationPolicyFilter } from "../form-filter/FormFilter";
import { TicketEscalationPolicyTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function TicketEscalationPolicyCard() {
  const UIContext = useTicketEscalationPolicyUIContext();

  const UIProps = useMemo(() => ({
    newTicketEscalationPolicyButtonClick: UIContext.newTicketEscalationPolicyButtonClick,
  }), [UIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.ticket_escalation_policy || [],
    }),
    shallowEqual
  );

  const accessUser = userAccess.find((item) => item.componentName === "CreateTicketEscalationPolicy");

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-end items-center flex-wrap gap-2 mb-3">
        <TicketEscalationPolicyFilter />
        <div className="flex items-center gap-2">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={UIProps.newTicketEscalationPolicyButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          )}
        </div>
      </div>

      <TicketEscalationPolicyTable />
    </TCard>
  );
}