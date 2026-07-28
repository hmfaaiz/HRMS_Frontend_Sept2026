// pages/Bonus_Policy/FormUIContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter, buildEmptySlab } from "./FormUIHelpers";

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
    Id: "",
    subsidiaryId: "",
    bonusTypeId: "",
    gradeId: "",
    employeeTypeId: "",
    sumOfEarningsComponents: [],
    considerConfirmationDate: false,
    confirmationDateBefore: "",
    considerJoiningDate: false,
    joiningDateBefore: "",
    salaryMonthOption: "CURRENT_SALARY",
    specificSalaryMonth: "",
    serviceSlabs: [buildEmptySlab()],
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
    openActiveFormDialog: FormUIEvents.openActiveFormDialog,
    openReadFormDialog: FormUIEvents.openReadFormDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}