import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEdit";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { getAllLoanType } from "../../../../Employee_Loan_Request/_redux/redux-Actions";

export function FormEditDialog({ id, employeeId, loanTypeId }) {
  const [loading, setLoading] = useState(false);

  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(
    () => ({
      initUser:      FormUIContext.initUser,
      queryParams:   FormUIContext.queryParams,
      setIds:        FormUIContext.setIds,
      employeeId:    FormUIContext.employeeId,
      loanTypeId:    FormUIContext.loanTypeId,
      isViewMode:    FormUIContext.isViewMode,
      setIsViewMode: FormUIContext.setIsViewMode,
      resetAll:      FormUIContext.resetAll,
    }),
    [FormUIContext]
  );

  const enableLoading  = () => setLoading(true);
  const disableLoading = () => setLoading(false);
  const dispatch = useDispatch();

  const { actionsLoading, userForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.cash_payment_against_loan?.actionsLoading ?? false,
      userForEdit:    state.cash_payment_against_loan?.userForEdit    ?? undefined,
    }),
    shallowEqual
  );

  useEffect(() => { dispatch(getAllLoanType()); }, [dispatch]);

  useEffect(() => {
    if (id && id !== "new") {
      dispatch(actions.fetchLoanCashPaymentById(id));
    } else {
      dispatch(actions.clearUserForEdit());
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id === "new" && employeeId && loanTypeId) {
      dispatch(actions.fetchLoanOutstanding(employeeId, loanTypeId));
    }
  }, [id, employeeId, loanTypeId, dispatch]);

  // ── Close modal only — do NOT clear the employee selection ───────────────
  const closeModal = () => {
    formUIProps.setIds("");
    dispatch(actions.clearUserForEdit());
  };

  // ── Cancel / X button — full reset (user explicitly cancels) ─────────────
  const onHide = () => {
    formUIProps.resetAll();
    dispatch(actions.clearUserForEdit());
    dispatch(actions.clearLoanOutstanding());
  };

  const saveForm = async (data, resetForm) => {
    enableLoading();

    const resolvedEmployeeId = data.employeeId  || formUIProps.employeeId  || employeeId;
    const resolvedLoanTypeId = data.loan_typeId || formUIProps.loanTypeId  || loanTypeId;

    const payload = {
      ...data,
      employeeId:  resolvedEmployeeId,
      loan_typeId: resolvedLoanTypeId,
    };

    const onSuccess = () => {
      resetForm();
      dispatch(actions.clearUserForEdit());

      // ── Refetch table so the saved/updated row appears immediately ────────
      if (resolvedEmployeeId) {
        dispatch(
          actions.fetchLoanCashPayments({
            ...formUIProps.queryParams,
            employeeId: resolvedEmployeeId,
          })
        );
      }

      // ── Refetch outstanding so next payment shows correct balance ─────────
      if (resolvedEmployeeId && resolvedLoanTypeId) {
        dispatch(actions.fetchLoanOutstanding(resolvedEmployeeId, resolvedLoanTypeId));
      }

      // ── Close modal without clearing the employee dropdown ────────────────
      closeModal();
    };

    if (!payload.Id) {
      await dispatch(
        actions.createLoanCashPayment(payload, disableLoading, onSuccess, null)
      );
    } else {
      await dispatch(
        actions.updateLoanCashPayment(payload, disableLoading, onSuccess, null)
      );
    }
  };

  if (!id) return null;

  const isEdit = !!(id && id !== "new");

  const currentUser =
    !isEdit || !userForEdit
      ? {
          ...formUIProps.initUser,
          employeeId:  formUIProps.employeeId || employeeId  || "",
          loan_typeId: formUIProps.loanTypeId || loanTypeId  || "",
        }
      : userForEdit;

  return (
    <>
      <FormEditDialogHeader id={id} isUserForRead={formUIProps.isViewMode} />

      <FormEditForm
        saveForm={saveForm}
        user={currentUser}
        onHide={onHide}
        actionsLoading={actionsLoading}
        isUserForRead={formUIProps.isViewMode}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={isEdit}
        disableLoading={disableLoading}
        formUIProps={formUIProps}
      />

      <ToastContainer
        position="top-right" autoClose={2000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false}
        pauseOnFocusLoss draggable pauseOnHover
      />
    </>
  );
}