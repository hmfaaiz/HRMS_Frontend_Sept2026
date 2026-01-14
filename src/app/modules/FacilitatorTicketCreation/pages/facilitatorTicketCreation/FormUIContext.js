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
  const [ids, setId] = useState([]);
  const [masterId, setMasterId] = useState();
   const [employeeId, setemployeeId] = useState('');
  const [isFileReq, setIsFileReq] = useState(false)
  const [readMode, setReadMode] = useState(false)
  const [receiveMode, setReceiveMode] = useState(false)
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
    assignTo: null,
    priorityLevelId: "",
    ticketDescription: "",
    remarks: "",
    ticketTypeId: "",
    dueDate: "",
    ticketDate: "",
    timeRangeFrom: "",
    timeRangeTo: "",
    noOfHours: "",
    ticketStatus:null,
    file: "",
  

  };

  const initTimeLog = {
    Id: "",
    loggedByEmpId:"",
    workDescription: "",
    loggedDate: "",
    timeRangeFrom: "",
    timeRangeTo: "",
    noOfHours: "",
    isBillable:false,
  
  

  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setId,
    initUser,
    setemployeeId,
    employeeId,
    panelMode,initTimeLog,
    setPanelMode, setReadMode, readMode,setReceiveMode,receiveMode,
    masterId, setMasterId,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
    openReceiveFormDialog: FormUIEvents.openReceiveFormDialog,
    openDetailGridData: FormUIEvents.openDetailGridData,
    openTicketTimeLog: FormUIEvents.openTicketTimeLog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
