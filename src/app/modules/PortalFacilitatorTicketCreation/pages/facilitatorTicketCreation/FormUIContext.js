import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter,initialReceiveFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [queryReceiveParams, setQueryReceiveParamsBase] = useState(initialReceiveFilter);
  const [ids, setId] = useState([]);
  const [masterId, setMasterId] = useState();
  const [detailId, setDetailId] = useState();
   const [employeeId, setemployeeId] = useState('');
  const [isFileReq, setIsFileReq] = useState(false)
  const [readMode, setReadMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [receiveMode, setReceiveMode] = useState(false)
  const [panelMode, setPanelMode] = useState(false);  
  const [currentLevel, setCurrentLevel] = useState(false);
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
  
  const setQueryReceiveParams = useCallback((nextQueryParams) => {
    setQueryReceiveParamsBase((prevQueryParams) => {
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
    queryReceiveParams,
    setQueryReceiveParamsBase,
    setQueryReceiveParams,
    ids,
    setId,
    initUser,
    setemployeeId,
    employeeId,
    panelMode,initTimeLog,setCurrentLevel,currentLevel,
    setPanelMode,
    setReadMode, readMode,
    setEditMode, editMode,
    setReceiveMode,receiveMode,
    masterId, setMasterId,setDetailId,detailId,
    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
    openReceiveFormDialog: FormUIEvents.openReceiveFormDialog,
    openDetailGridData: FormUIEvents.openDetailGridData,
    openTicketTimeLog: FormUIEvents.openTicketTimeLog,
    openDetailTimeLog: FormUIEvents.openDetailTimeLog,
    openTicketFollowUp: FormUIEvents.openTicketFollowUp,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
