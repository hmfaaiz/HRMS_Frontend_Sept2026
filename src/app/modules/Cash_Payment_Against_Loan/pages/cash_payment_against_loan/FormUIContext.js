import React, { createContext, useContext, useState, useCallback } from "react";

const FormUIContext = createContext();

const initialQueryParams = {
  pageNumber: 1,
  pageSize: 10,
  sortOrder: "desc",
  filter: {},
};

export function FormUIProvider({ children }) {
  const [ids, setIds]               = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  const [employeeId, setemployeeId]       = useState(null);
  const [panelMode, setPanelMode]         = useState(false);
  const [loanTypeId, setLoanTypeId]       = useState(null);
  const [loanPanelMode, setLoanPanelMode] = useState(false);

  const [queryParams, setQueryParams] = useState(initialQueryParams);

  // ── Delete dialog state ───────────────────────────────────────────────────
  const [deleteId, setDeleteId]           = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const openDeleteFormDialog = useCallback((id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  }, []);

  const closeDeleteFormDialog = useCallback(() => {
    setDeleteId(null);
    setShowDeleteDialog(false);
  }, []);

  // ── Reset ALL — called on Save, Cancel, and after Delete ─────────────────
  const resetAll = useCallback(() => {
    setIds("");
    setIsViewMode(false);
    setemployeeId(null);
    setPanelMode(false);
    setLoanTypeId(null);
    setLoanPanelMode(false);
  }, []);

  const initUser = {
    Id: "",
    employeeId: "",
    loan_typeId: "",
    employee_loan_requestId: "",
    payrollMonthId: "",
    payment_date: "",
    payment_amount: "",
    payment_reference_no: "",
    loan_outstanding_balance_after: "",
    deduct_in_active_payroll: false,
    remarks: "",
  };

  return (
    <FormUIContext.Provider
      value={{
        ids,           setIds,
        isViewMode,    setIsViewMode,
        employeeId,    setemployeeId,
        panelMode,     setPanelMode,
        loanTypeId,    setLoanTypeId,
        loanPanelMode, setLoanPanelMode,
        queryParams,   setQueryParams,
        initUser,
        resetAll,
        // Delete dialog
        deleteId,
        showDeleteDialog,
        openDeleteFormDialog,
        closeDeleteFormDialog,
      }}
    >
      {children}
    </FormUIContext.Provider>
  );
}

export function useFormUIContext() {
  return useContext(FormUIContext);
}