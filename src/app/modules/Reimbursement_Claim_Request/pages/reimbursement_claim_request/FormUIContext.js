import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReimbursementUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [employeeId, setemployeeId] = useState("");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [ids, setIds] = useState("");
  const [workflowId, setWorkflowId] = useState(null);
  const [currentData, setCurrentData] = useState(null);
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
    Id: "",
    employeeId: employeeId,
    reimbursement_typeId: "",
    amount: "",
    details: "",
    date: "",
    file: "",
    pay_in_payroll_forId: "",
    subsidiaryId: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    currentLevel,
    setCurrentLevel,
    initUser,
    setemployeeId,
    employeeId,
    workflowId,
    setWorkflowId,
    currentData,
    setCurrentData,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}