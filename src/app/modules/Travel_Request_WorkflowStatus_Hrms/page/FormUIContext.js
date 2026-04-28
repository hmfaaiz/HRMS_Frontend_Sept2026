import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParams] = useState(initialFilter);
  const [travelRequestId, setTravelRequestId] = useState(null);
  const [WorkflowId, setWorkflowId] = useState(null);
  const [travelData, setTravelData] = useState(null);
  const [Ids, setIds] = useState([]);
  const setQueryParamsTravelApproval = useCallback((nextQueryParams) => {
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
    setQueryParamsTravelApproval,
    travelRequestId,
    setTravelRequestId,
    WorkflowId,
    setWorkflowId,
    travelData,
    setTravelData,
    setQueryParams,
    Ids,
    setIds,
    ...FormUIEvents,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
