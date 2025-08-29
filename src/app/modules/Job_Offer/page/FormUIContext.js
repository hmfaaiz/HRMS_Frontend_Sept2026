import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const ReceiptUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [signatoryisShow, setSignatoryisShow] = useState(false);
  const [applicantVacancyId, setApplicantVacancyId] = useState(null);
  const [headOfHrId, setHeadOfHrId] = useState(null);
  const [hrId, setHrId] = useState(null);
  const [panelMode, setPanelMode] = useState(false);
  const [panelMode2, setPanelMode2] = useState(false);
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
 
  };

  const value = {
    selectedJob,
    setSelectedJob,
    selectedApplicant,
    setSelectedApplicant,
    FormUIEvents,
    applicantVacancyId,
    setApplicantVacancyId,

    queryParams,
    setQueryParamsBase,
    setQueryParams,
    ids,
    setIds,
    setHrId,
    hrId,
    setHeadOfHrId,
    headOfHrId,
    initUser,
    setSignatoryisShow,signatoryisShow,
    panelMode,
    setPanelMode,
    panelMode2,
    setPanelMode2,
    
  };
  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
