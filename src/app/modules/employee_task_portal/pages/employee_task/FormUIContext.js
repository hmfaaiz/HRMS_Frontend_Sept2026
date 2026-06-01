import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelper";

const FormUIContext = createContext();

export function useFormUIContext() {
  return useContext(FormUIContext);
}

export const FormUIConsumer = FormUIContext.Consumer;

export function FormUIProvider({ FormUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);

  const [panelMode, setPanelMode] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
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

  const [taskType, setTaskType] = useState("onboarding");

  const openTaskModal = useCallback((taskId, type = "onboarding") => {
    setSelectedTaskId(taskId);
    setIsViewOnly(false);
    setShowModal(true);
    setTaskType(type);
  }, []);

  const openViewModal = (id, type = "onboarding") => {
    setSelectedTaskId(id);
    setIsViewOnly(true);
    setShowModal(true);
    setTaskType(type);
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedTaskId(null);
    setIsViewOnly(false);
  }, []);

  // ── Onboarding checklist filter (independent) ──
  const [taskFilter, setTaskFilter] = useState("pending");

  // ── Exit Clearance filter (independent, decoupled from onboarding) ──
  const [exitClearanceFilter, setExitClearanceFilter] = useState("pending");

  const value = {
    queryParams,
    setQueryParams,
    setQueryParamsBase,

    panelMode,
    setPanelMode,
    employeeId,
    setEmployeeId,

    selectedTaskId,
    showModal,
    isViewOnly,
    openTaskModal,
    openViewModal,
    closeModal,

    taskFilter,
    setTaskFilter,

    exitClearanceFilter,
    setExitClearanceFilter,

    taskType,

    ...FormUIEvents,
  };

  return (
    <FormUIContext.Provider value={value}>{children}</FormUIContext.Provider>
  );
}
