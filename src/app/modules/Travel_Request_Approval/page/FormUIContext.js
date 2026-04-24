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
  const [currentData, setCurrentData] = useState(null);
  const [Ids, setIds] = useState([]);
  const [panelMode, setPanelMode] = useState(false);
  const [userForEdit, setUserForEdit] = useState(null);
  const [userForRead, setUserForRead] = useState(false);
  const [id, setId] = useState(null);
  const [showWorkflow, setShowWorkflow] = useState(false);

  const setQueryParamsTravelRequestApproval = useCallback((nextQueryParams) => {
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
    setQueryParamsTravelRequestApproval,
    workflowId,
    setWorkflowId,
    currentData,
    setCurrentData,
    setQueryParams,
    Ids,
    setIds,
    panelMode,
    setPanelMode,
    userForEdit,
    setUserForEdit,
    userForRead,
    setUserForRead,
    id,
    setId,
    showWorkflow,
    setShowWorkflow,
    openEditFormDialog: (row) => {
      setPanelMode(true);
      setId(row.Id); // This is the Workflow ID for the fetch/submission
      setUserForRead(false);
      setShowWorkflow(false); // Ensure workflow modal is closed
    },
    openReadFormDialog: (row) => {
      setPanelMode(true);
      setId(row.Id);
      setUserForRead(true);
      setShowWorkflow(false);
    },
    viewWorkflow: (row) => {
      setWorkflowId(row.parentRecordId); // Timeline usually needs parent record ID
      setCurrentData(row);
      setShowWorkflow(true); // Open the workflow modal
      setPanelMode(false); // Close the edit panel if open
    },
    ...FormUIEvents,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
