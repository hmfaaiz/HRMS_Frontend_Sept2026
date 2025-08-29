import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParamsLeaveEnc, setQueryParamsLeaveEncBaseLeaveEnc] = useState(initialFilter);
  const [employeeId, setemployeeId] = useState('');
  const [yearId, setyearId] = useState('');
  const [id, setId] = useState('');
  const [panelMode, setPanelMode] = useState(false);
  const setQueryParamsLeaveEnc = useCallback((nextQueryParams) => {
    setQueryParamsLeaveEncBaseLeaveEnc((prevQueryParams) => {
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
    leaveType: '',
    reason: '',
    days: '',
  };

  //Set Id for Edit record
  const editRecord = (id) => {
    setId(id)
  }

  const value = {
    queryParamsLeaveEnc,
    setQueryParamsLeaveEncBaseLeaveEnc,
    setQueryParamsLeaveEnc,
    employeeId,
    setemployeeId,
    yearId,
    setyearId,
    id,
    setId,
    editRecord,
    initUser,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    panelMode,
    setPanelMode,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
