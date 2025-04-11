import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParamsLeaveApp, setQueryParamsLeaveAppBaseLeaveApp] = useState(initialFilter);
  const [employeeId, setemployeeId] = useState('');
  const [id, setId] = useState('');
  const setQueryParamsLeaveApp = useCallback((nextQueryParams) => {
    setQueryParamsLeaveAppBaseLeaveApp((prevQueryParams) => {
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
    to: '',
    from: '',
    leaveType: '',
    remarks: '',
    days: '',
    file: null,
    request_status : 'P',
  };

  //Set Id for Edit record
  const editRecord = (id) => {
    setId(id)
  }

  const value = {
    queryParamsLeaveApp,
    setQueryParamsLeaveAppBaseLeaveApp,
    setQueryParamsLeaveApp,
    id,
    setId,
    editRecord,
    employeeId,
    setemployeeId,
    initUser,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
