import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";
const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}
export function useRosterRequestUIContext() {
  return useContext(FormUIContext);
}


export const initUser = {
  employeeId: "",
  from: "",
  to: "",
  shiftId: null,
  patternId: null,
  offDay_1: null,
  offDay_2: null,
  isEnable_roster_via_shift: false,
  isEnable_roster_via_pattern: false,
  authortiesList: [],
  request_remarks: "",
};

export function FormUIProvider({ children, FormUIEvents }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds]               = useState(null);
  const [employeeId, setemployeeId] = useState(null); 
  const [workflowId, setWorkflowId] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const setQueryParams = useCallback((nextQueryParams) => {
    setQueryParamsBase((prev) => {
      if (isFunction(nextQueryParams)) nextQueryParams = nextQueryParams(prev);
      if (isEqual(prev, nextQueryParams)) return prev;
      return nextQueryParams;
    });
  }, []);

  const value = {
    queryParams,
    setQueryParams,
    ids,
    setIds,
    employeeId,       
    setemployeeId,    
    initUser,
    openDeleteDialog: FormUIEvents?.openDeleteDialog,
    workflowId,
    setWorkflowId,
    currentData,
    setCurrentData,
  };

  return (
    <FormUIContext.Provider value={value}>
      {children}
    </FormUIContext.Provider>
  );
}