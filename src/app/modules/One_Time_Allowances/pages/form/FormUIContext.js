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
  const [ids, setIds] = useState([]);
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
  const initUser = {
    EmpId: "",
    earning_deduction_list: [],
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
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
