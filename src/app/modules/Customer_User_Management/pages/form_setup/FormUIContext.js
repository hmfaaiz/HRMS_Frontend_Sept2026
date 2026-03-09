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
  const [customerId, setCustomerId] = useState(null);
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
    firstName: "",
    middleName: "",
    lastName: "",
    designation: "",
    email: "",
    password: "",
    isActive: true,
  };

  const value = {
    queryParams,
    setQueryParams,
    customerId,
    setCustomerId,
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
