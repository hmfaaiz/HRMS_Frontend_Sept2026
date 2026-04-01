import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter, initialValues } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
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

  const initUser = initialValues;



  const value = useMemo(() => {
    return {
      queryParams,
      setQueryParamsBase,
      setQueryParams,
      ids,
      setIds,
      initUser,
      newFormButtonClick: FormUIEvents.newFormButtonClick,
      openEditFormDialog: FormUIEvents.openEditFormDialog,
      openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
      openActiveFormDialog: FormUIEvents.openActiveFormDialog,
      openReadFormDialog: FormUIEvents.openReadFormDialog,
    };
  }, [queryParams, ids, FormUIEvents, initUser, setQueryParams]);

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
