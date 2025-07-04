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
    subsidiaryId: "",
    companyId: "",
    jobCode: "",
    jobDate: "",
    designationId: "",
    jobTitle: "",
    gradeId: "",
    locationId: "",
    jobPostingDateFrom: "",
    jobPostingDateTo: "",
    countryId: null,
    cityId: null,
    employeeTypeId: "",
    employeeStatusId: "",
    departmentId:"",
    reportToDesignationId: "",
    relationshipWithReportTo: "",
    noOfPosition: "",
    hiringReasonId: "",
    jobPreferenceId: "",
    appointmentTypeId: "",
    comment: "",
    jobPeriodStart: "",
    jobPeriodEnd: "",
    desireDateOfApp: "",
    priorityTypeId: "",
    criticalDays: "",
    preferredAgeFrom: null,
    preferredAgeTo: null,
    preferredShiftId: "",
    preferredGenderId: "",
    preferredQualificationId: "",
    preferredJobSkillsId: "",
    preferredJobIndustryId: "",
    workExpFrom: "",
    workExpTo: "",
    workExpDetail: "",
    additionalReq: "",
    salaryRangeFrom: "",
    salaryRangeTo: "",
    incentivePackages: "",
    otherBenefits: "",
    jobSummary: "",
    optionalJobSkillsId:"",

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
