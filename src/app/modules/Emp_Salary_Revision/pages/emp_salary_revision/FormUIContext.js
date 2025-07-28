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
  const [ids, setIds] = useState("");
  const [isFileReq, setIsFileReq] = useState(false);
  const [panelMode, setPanelMode] = useState(false);
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
    employeeId: "",
    currencyId : "",
    grossSalary : "",
    basicSalary : "",
    gratuity_member : "",
    gratuity_startDate : "",
    overtime_allowance : "",
    shift_allowance : "",
    regularity_allowance : "",
    punctuality_allowance : "",
    pf_member : "",
    pf_reg_date : "",
    pf_accNo : "",
    eobi_member : "",
    eobi_reg_date : "",
    eobi_accNo : "",
    social_security_member : "",
    social_security_reg_date : "",
    social_security_accNo: "",
    pension_member : "",
    pension_reg_date : "",
    pension_accNo : "",
    profit_member : "",
    emp_bankId : "",
    emp_bank_branchId : "",
    emp_bank_accountTitle : "",
    emp_bank_accNo : "",
    payment_mode_Id : "",
    company_bankId : "",
    company_branchId : "",
    company_from_accNo : "",
    overtime_working_day: "",
    overtime_off_day: "",
    overtime_holiday: "",
    revisedDate:"",
    Employee:"",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    isFileReq,
    setIsFileReq,
    initUser,
    setemployeeId,
    employeeId,
    panelMode,
    setPanelMode,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
