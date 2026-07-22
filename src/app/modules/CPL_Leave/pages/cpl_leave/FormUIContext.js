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

  subsidiaryId: null,
  gradeId: null,
  employeeTypeId: null,

  // Business Days
  HalfDay_BusinessDay: "",
  FullDay_BusinessDay: "",
  Onehalf_BusinessDay: "",
  Double_BusinessDay: "",

  // Off Days
  HalfDay_OffDay: "",
  FullDay_OffDay: "",
  Onehalf_OffDay: "",
  Double_OffDay: "",

  // Holidays
  HalfDay_Holiday: "",
  FullDay_Holiday: "",
  Onehalf_Holiday: "",
  Double_Holiday: "",

  isAttProcessExecuted: 0,
  accumulateDays: "",
  cplGeneratedTillEndDate: null,


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
