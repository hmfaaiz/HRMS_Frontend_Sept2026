import React, { createContext, useContext, useCallback, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./LastTripsUIHelpers";

const LastTripsUIContext = createContext();

export function useLastTripsUIContext() {
  return useContext(LastTripsUIContext);
}

export const LastTripUIConsumer = LastTripsUIContext.Consumer;

export function LastTripsUIProvider({ TripLogsUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  //console.log("TripLogsUIEvents", TripLogsUIEvents);

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prevQueryParams) => {
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
  });
  const value = {
    queryParams,
    setQueryParams,
    setQueryParamsBase,
    openLastTripsDialog: TripLogsUIEvents.openLastTripsDialog,
  };

  return (
    <LastTripsUIContext.Provider value={value}>
      {children}
    </LastTripsUIContext.Provider>
  );
}
