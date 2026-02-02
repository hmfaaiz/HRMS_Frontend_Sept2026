import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ formUIEvents, children }) {
  // table state
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [Id, setId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [panelMode, setPanelMode] = useState(false);

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

  const initVal = {
    projectId: "",
    ticketId: "",
    loggedDate: "",
    workDescription: "",
    timeRangeFrom: "",
    timeRangeTo: "",
    noOfHours: "",
    isBillable: false,
  };

  const value = {
    queryParams,
    setQueryParams,
    Id,
    setId,
    initVal,
    employeeId,
    panelMode,
    setPanelMode,
    setEmployeeId,
    openDeleteDialog: formUIEvents.openDeleteDialog,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
