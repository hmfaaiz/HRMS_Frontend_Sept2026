import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParams] = useState(initialFilter);
  const [leaveBalanceId, setLeaveBalanceId] = useState(null);
  const [leaveWorkflowId, setLeaveWorkflowId] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
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
    leaveBalanceId,
    setLeaveBalanceId,
    leaveWorkflowId,
    setLeaveWorkflowId,
    leaveData,
    setLeaveData,
    setQueryParams,
    Ids,
    setIds,
    ...FormUIEvents,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
