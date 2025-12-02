import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./EmployeeUIHelpers";

const EmployeeUIContext = createContext();

export function useEmployeeUIContext() {
  return useContext(EmployeeUIContext);
}

export const ReceiptUIConsumer = EmployeeUIContext.Consumer;

export function EmployeeUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setId] = useState([]);
   const [employeeId, setemployeeId] = useState('');
  const [isFileReq, setIsFileReq] = useState(false)
  const [readMode, setReadMode] = useState(false)
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
    subsidiaryId: null,
    docName: "",
    docDesc: "",
    empAttachment: "",

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
    panelMode,
    setPanelMode, setReadMode, readMode,
  
  };
  return (
    <EmployeeUIContext.Provider value={value}>{children}</EmployeeUIContext.Provider>
  );
}
