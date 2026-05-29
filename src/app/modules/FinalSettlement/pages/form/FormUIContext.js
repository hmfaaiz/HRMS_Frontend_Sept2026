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
  const [ids, setIds] = useState([]);
  const [panelMode, setPanelMode] = useState(false);
  const [attSumPanelMode, setAttSumPanelMode] = useState(false);
    const [employeeId, setemployeeId] = useState('');
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

  employeeId:"",
  paidDays:"",
  earning_list:[],
  deduction_list:[],
  otherPayment: "",
  otherPaymentRemarks: "",
  otherDeduction: "",
  oherDeductionRemarks: "",
  totalEarnings: "",
  totalDeduction: "",
  netSalary: "",
  loanBalance: "",
  gratuityAmount: 0,
  totalPFAmount: 0,
  pf_employer_amount: 0,
  pf_employee_amount: 0,
  exitClearence: "",
  hrRemarks: "",
  pension_employer_amount : 0,
  pension_employee_amount : 0,
  totalPensionAmount : 0,



 
};



  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
    employeeId,
    panelMode,
    setPanelMode,
    attSumPanelMode,
    setAttSumPanelMode,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
    openConvertFormDialog: FormUIEvents.openConvertFormDialog,
  
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
