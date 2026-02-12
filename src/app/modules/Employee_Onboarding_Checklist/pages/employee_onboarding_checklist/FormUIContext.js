import React, { createContext, useContext, useState, useCallback } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "./FormUIHelpers"; 

// Create Context
const EmployeeOnboardingUIContext = createContext();

// Custom hook to use the context
export function useEmployeeOnboardingUIContext() {
  return useContext(EmployeeOnboardingUIContext);
}

// Consumer export (optional)
export const EmployeeOnboardingUIConsumer = EmployeeOnboardingUIContext.Consumer;

// Provider component
export function EmployeeOnboardingUIProvider({ UIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState(initialFilter);
  const [selectedIds, setSelectedIds] = useState([]);
  const [panelMode, setPanelMode] = useState(false);

  // NEW: Delete modal state
  const [idToDelete, setIdToDelete] = useState(null);

  // Update query params
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

  // Default form state
  const initChecklist = {
    employeeId: "",
    taskStatus: "",
    list: [],
  };

  // Open/close Delete modal
  const openDeleteDialog = (Id) => setIdToDelete(Id);
  const closeDeleteDialog = () => setIdToDelete(null);

  const value = {
    queryParams,
    setQueryParamsBase,
    setQueryParams,
    selectedIds,
    setSelectedIds,
    panelMode,
    setPanelMode,
    initChecklist,

    // Event handlers from UI
    newFormButtonClick: UIEvents.newFormButtonClick,
    openEditFormDialog: UIEvents.openEditFormDialog,
    openReadFormDialog: UIEvents.openReadFormDialog,
    openDeleteFormDialog: (Id) => openDeleteDialog(Id), // override to use state
    closeDeleteDialog,
    idToDelete, // expose the current delete Id
  };

  return (
    <EmployeeOnboardingUIContext.Provider value={value}>
      {children}
    </EmployeeOnboardingUIContext.Provider>
  );
}
