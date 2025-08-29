import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export function FormUIProvider({ children }) {
  const initFilters = {
    employeeId: '',
    leaveType: '',
    yearId: '',
  };
  const [filters, setfilters] = useState(initFilters)

  const initUser = {
    allocatedCount: '',
    remainingCount: '',
    lateCount: '',
    availedCount: '',
    carryForwardCount: '',
    encashmentCount: '',
  };
  const value = {
    initUser,
    filters,
    setfilters
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
