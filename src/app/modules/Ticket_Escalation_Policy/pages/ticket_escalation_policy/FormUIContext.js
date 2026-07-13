import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const TicketEscalationPolicyUIContext = createContext();

export function useTicketEscalationPolicyUIContext() {
  return useContext(TicketEscalationPolicyUIContext);
}

export const TicketEscalationPolicyUIConsumer = TicketEscalationPolicyUIContext.Consumer;

export function TicketEscalationPolicyUIProvider({ TicketEscalationPolicyUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
      if (isFunction(nextQueryParams)) {
        nextQueryParams = nextQueryParams(prevQueryParams);
      }
      if (isEqual(prevQueryParams, nextQueryParams)) {
        return prevQueryParams;
      }
      return nextQueryParams;
    });
  }, []);

  const initTicketEscalationPolicy = {
    companyId: "",
    subsidiaryId: "",
    ticketTypeId: "",
    isActive: true,
    rules: [{ priorityLevelId: null, exceedDays: "", moveToEmployeeId: null }],
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initTicketEscalationPolicy,
    newTicketEscalationPolicyButtonClick: TicketEscalationPolicyUIEvents?.newTicketEscalationPolicyButtonClick,
    openEditTicketEscalationPolicyDialog: TicketEscalationPolicyUIEvents?.openEditTicketEscalationPolicyDialog,
    openDeleteTicketEscalationPolicyDialog: TicketEscalationPolicyUIEvents?.openDeleteTicketEscalationPolicyDialog,
    openReadTicketEscalationPolicyDialog: TicketEscalationPolicyUIEvents?.openReadTicketEscalationPolicyDialog,
  };

  return (
    <TicketEscalationPolicyUIContext.Provider value={value}>
      {children}
    </TicketEscalationPolicyUIContext.Provider>
  );
}