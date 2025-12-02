import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [employeeId, setemployeeId] = useState("");
  const [panelMode, setPanelMode] = useState(false);

  const initFilters = {
    employeeId: "",
    attDateIn: "",
  };
  const [filters, setfilters] = useState(initFilters);
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
    employeeId: "",
    comments: "",
    attDateIn: "",
    attDateOut: "",
    timeIn: "",
    timeOut: "",
    shiftCode: "",
    shiftStartTime: "",
    shiftEndTime: "",
    interShifGap: "",
    shiftWorkingHours: "",
    shiftLateIn: "",
    shiftEarlyOut: "",
    shiftHalfDayStart: "",
    shiftHalfDayEnd: "",
    isOverTime: "",
    isIncludeInterShifGap: "",
    lateInHours: "",
    overtimeStart: "",
    oT: "",
    approvedOT: "",
    workedHours: "",
    attendanceStatus: "",
  };

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    filters,
    setfilters,
    initUser,
    currentLevel,
    setCurrentLevel,
    employeeId,
    setemployeeId,
    panelMode,
    setPanelMode,
    ...FormUIEvents,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
