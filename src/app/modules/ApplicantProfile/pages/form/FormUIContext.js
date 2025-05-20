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
    
    subsidiaryId: "",
    companyId: "",
    applicantCode: "",

    title: "",
    firstName: "",
    middleName: "",
    lastName: "",

    dateOfBirth: "",  // Assuming input as a string in the filter
    laborCardNo: "",
    passportNo: "",
    maritalStatus: "",
    nationality: "",
    gender: "",
    relation_name: "",
    religionId: "",

    countryId: "",
    cityId: "",
    additional_summary: "",
    phone_official: "",
    phone_cell: "",
    email_personal: "",
nic_no:"",
    applicantCanJoin: "",
    lastDawnSalary: "",
    lastDawnSalaryCurrencyId: "",
    lastDawnSalaryPayTypeId: "",
    expectedSalaryRangeFrom: "",
    expectedSalaryRangeTo: "",
    expectedSalaryCurrencyId: "",
    expectedSalaryPayTypeId: "",
    otherInformation: "",
    currentDesignation: "",

  



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
    openPostingFormDialog:FormUIEvents.openPostingFormDialog,
    openHoldFormDialog:FormUIEvents.openHoldFormDialog,
    openCloseFormDialog:FormUIEvents.openCloseFormDialog,
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
