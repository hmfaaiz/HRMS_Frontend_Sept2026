import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [workflowId, setWorkflowId] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [Ids, setIds] = useState([]);

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
    setQueryParams,
    workflowId,
    setWorkflowId,
    currentData,
    setCurrentData,
    Ids,
    setIds,
    ...FormUIEvents,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}