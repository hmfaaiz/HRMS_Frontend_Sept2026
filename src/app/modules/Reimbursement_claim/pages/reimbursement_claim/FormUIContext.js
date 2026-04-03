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
  const [employeeId, setemployeeId] = useState('');
  const [ids, setIds] = useState("");
  const [isFileReq,setIsFileReq]=useState(false)
  const [readMode,setReadMode]=useState(false)
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


  const initUser={
    Id: "",
    reimbursement_typeId: "",
    employeeId:employeeId,
    details: "",
    date:"",
    amount:"",
    file:"",
    pay_in_payroll_forId:"", 
    request_status: "A",
    // pay_slip_refId: "", 


  }



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
    setPanelMode,setReadMode,readMode,
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
