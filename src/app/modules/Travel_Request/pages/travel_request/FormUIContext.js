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
  const [panelMode, setPanelMode] = useState(false);
  const [userForEdit, setUserForEdit] = useState(null);
  const [userForRead, setUserForRead] = useState(false);
  const [workflowId, setWorkflowId] = useState(null);
  const [workflowRowData, setWorkflowRowData] = useState(null);
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

  const initUser = initialValues;

  const value = useMemo(() => {
    return {
      queryParams,
      setQueryParamsBase,
      setQueryParams,
      ids,
      setIds,
      initUser,
      panelMode,
      setPanelMode,
      userForEdit,
      setUserForEdit,
      userForRead,
      setUserForRead,
      employeeId,
      setEmployeeId,
      workflowId,
      setWorkflowId,
      workflowRowData,
      setWorkflowRowData,
      newFormButtonClick: FormUIEvents.newFormButtonClick,
    };
 }, [queryParams, ids, FormUIEvents, initUser, panelMode, userForEdit, userForRead, employeeId, setQueryParams, workflowId, workflowRowData]);

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
