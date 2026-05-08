import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const FormUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  // Filter/query params state
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  // Panel and employee states
  const [panelMode, setPanelMode] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [subsidiaryId, setSubsidiaryId] = useState(null);
  const [appraisalCategoryId, setAppraisalCategoryId] = useState(null);

  // Modal state
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
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

  const openRecommendationModal = useCallback((interviewId) => {
    setSelectedInterviewId(interviewId);
    setIsViewOnly(false); 
    setShowModal(true);
  }, []);

  const openViewModal = (id) => {
  setSelectedInterviewId(id);
  setIsViewOnly(true);
  setShowModal(true);
};
  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedInterviewId(null);
    setIsViewOnly(false);
  }, []);
  const [recommendationFilter, setRecommendationFilter] = useState("pending");
  const value = {
    // Filter/query params
    queryParams,
    setQueryParams,
    setQueryParamsBase,

    // Panel and employee management
    panelMode,
    setPanelMode,
    employeeId,
    setEmployeeId,
    subsidiaryId,
    setSubsidiaryId,
    appraisalCategoryId,
    setAppraisalCategoryId,

    // Modal management
    selectedInterviewId,
    showModal,
    isViewOnly,
  openRecommendationModal,
  openViewModal,
  closeModal,
  recommendationFilter,
  setRecommendationFilter,

    ...FormUIEvents,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}