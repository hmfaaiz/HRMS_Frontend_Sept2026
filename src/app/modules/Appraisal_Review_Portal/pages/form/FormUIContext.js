import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFromUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;
export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [panelMode, setPanelMode] = useState(false);
  const [subsidiaryId, setSubsidiaryId] = useState(null);
  const [appraisalCategoryId, setAppraisalCategoryId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
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

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    subsidiaryId,
    setSubsidiaryId,
    appraisalCategoryId,
    setAppraisalCategoryId,
    employeeId,
    setEmployeeId,
    panelMode,
    setPanelMode,
    newButtonClick: FormUIEvents.newButtonClick,
    openEditDialog: FormUIEvents.openEditDialog,
    openDeleteDialog: FormUIEvents.openDeleteDialog,
    openReadDialog: FormUIEvents.openReadDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
