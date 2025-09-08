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
  Id: null,

  employeeId: "",
  exitTypeId: "",
  exitReasonId: "",
  exitRemark: "",

  acceptedEmployeeId: "",
  acceptanceRemarks: "",

  resignationDate: "",                // DATE
  resignationAcceptanceDate: "",      // DATE
  LastWorkingDate: "",                // DATE

  finalSettlementPolicy: "",
  noticePeriodDays: "",
  noticePeriodtype: "",

  hrRemarks: "",
  blackList: false,
  blackListRemarks: "",
  resignationAttachment: "",

  resignedFlag: false,
  separatedFlag: false,
  reinstatedFlag: false,
  reinstatedRemarks: "",

  subsidiaryId: "",
  companyId: "",

  isActive: true,
  createdBy: "",
  updatedBy: "",
  createdAt: "",
  updatedAt: "",
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
    openConvertFormDialog: FormUIEvents.openConvertFormDialog,
  
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
