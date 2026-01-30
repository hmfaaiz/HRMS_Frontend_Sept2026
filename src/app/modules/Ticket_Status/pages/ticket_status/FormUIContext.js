import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";

// Initial filter structure for table (like pagination, search, sort)
import { initialFilter } from "./FormUIHelpers";

const TicketStatusUIContext = createContext();

export function useTicketStatusUIContext() {
  return useContext(TicketStatusUIContext);
}

export function TicketStatusUIProvider({ TicketStatusUIEvents, children }) {
  // Table state
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

  // Initial form values
  const initTicketStatus = {
    statusCode: "",
    statusName: "",
    statusTypeId: "", // Can be '1' | '2' | '3' if using IDs or string if text
    isActive: true,
  };

  const value = {
    queryParams,
    setQueryParams,
    ids,
    setIds,
    initTicketStatus,

    // ROUTE-BASED actions (UI callbacks)
    newTicketStatusButtonClick: TicketStatusUIEvents.newTicketStatusButtonClick,
    openEditTicketStatusDialog: TicketStatusUIEvents.openEditTicketStatusDialog,
    openReadTicketStatusDialog: TicketStatusUIEvents.openReadTicketStatusDialog,
    openDeleteTicketStatusDialog: TicketStatusUIEvents.openDeleteTicketStatusDialog,
  };

  return (
    <TicketStatusUIContext.Provider value={value}>
      {children}
    </TicketStatusUIContext.Provider>
  );
}
