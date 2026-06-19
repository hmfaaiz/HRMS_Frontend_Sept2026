import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";
import { WEEK_DAY_STRING } from "../../../../utils/constants";
const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [ids, setIds] = useState([]);

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
    subsidiaryId: "",
    companyId: 1,
    name: "",
    shiftCode: "",
    shiftType: "",
    startTime: "",
    endTime: "",
    workingdays: [...Object.values(WEEK_DAY_STRING)],
    earlyIn: "",
    earlyOut: "",
    halfDayStart: "",
    halfDayEnd: "",
    breakTimeStart: "",
    breakTimeEnd: "",
    isOverTime: "",
    overTimeStart: "",
    interShiftGap: "",
    isIncludeInterShifGap: false,
    markAbsent: "",
    markHalfDay: "",
    startDate: "",  
    endDate: "",     
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,

    newFormButtonClick: FormUIEvents.newFormButtonClick,
    openEditFormDialog: FormUIEvents.openEditFormDialog,
    openDeleteFormDialog: FormUIEvents.openDeleteFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
  };

  return (
    <FormUIContext.Provider value={value}>
      {children}
    </FormUIContext.Provider>
  );
}