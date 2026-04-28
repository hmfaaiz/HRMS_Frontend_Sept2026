import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParams] = useState(initialFilter);
  const [workflowId, setWorkflowId] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [Ids, setIds] = useState([]);
  const setQueryParamsLeaveApproval = useCallback((nextQueryParams) => {
    setQueryParams((prevQueryParams) => {
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
    setQueryParamsLeaveApproval,
    workflowId,
    setWorkflowId,
    rowData,
    setRowData,
    setQueryParams,
    Ids,
    setIds,
    ...FormUIEvents,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
