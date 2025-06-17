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
      searchText: "",
    departmentId: null,
    designationId: null,
    gradeId: null,
    locationId: null,
    countryId: null,
    cityId: null,
    appointmentTypeId: null,


    //vacancy detail
    applicantStatusId: null,
    priorityTypeId: null,
    desireFromDateOfApp: null,
    desireToDateOfApp: null,
    jobFinalizedFromDate: null, jobFinalizedToDate: null,

    // Professional information
    workExpFrom: null,
    workExpTo: null,
    expectedSalaryRangeFrom: null,
    expectedSalaryRangeTo: null,
    expectedSalaryCurrencyId: null,
    expectedSalaryPayTypeId: null,
    companyName: null,
    preferredQualificationId: null,


    // Personal Information
    preferredAgeFrom: null,
    preferredAgeTo: null,
    maritalStatus: null,
    gender: null,
    religionId: null,
    nationality: null,
    applicantCanJoin: null,


  };



  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    initUser,
  
    openEditFormDialog: FormUIEvents.openEditFormDialog,
  
    openReadFormDialog: FormUIEvents.openReadFormDialog,
    openApplicantReadFormDialog:FormUIEvents.openApplicantReadFormDialog,}
    
   
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
