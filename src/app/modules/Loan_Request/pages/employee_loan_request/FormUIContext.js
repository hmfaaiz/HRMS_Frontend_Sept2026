import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [employeeId, setemployeeId] = useState("");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [ids, setIds] = useState("");
  const [isFileReq, setIsFileReq] = useState(false);
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
    employee_loan_accountId: null,
    loan_typeId: "",
    monthly_installment: "",
    applied_date: "",
    installment_start_date: "",
    total_loan_amount: "",
    total_installment: "",
    reason: "",
    loan_amount_remaining: "",
    loan_amount_paid: "",
    subsidiaryId: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    isFileReq,
    setIsFileReq,
    currentLevel,
    setCurrentLevel,
    initUser,
    setemployeeId,
    employeeId,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
