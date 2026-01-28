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

  const initVal = {
    projectCode: "",
    projectName: "",
    projectInitial: "",
    projectTypeId: "",
    projectOwnerEmpId: "",
    accessEmpIds: [],
    customerId: null,
    datesMandatory: false,
  };

  const value = {
    queryParams,
    setQueryParams,
    ids,
    setIds,
    initVal,
    newButtonClick: formUIEvents.newButtonClick,
    openEditDialog: formUIEvents.openEditDialog,
    openReadDialog: formUIEvents.openReadDialog,
    openDeleteDialog: formUIEvents.openDeleteDialog,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
