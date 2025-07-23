import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
  const FormUIContext = useFormUIContext();

  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
      queryParams: FormUIContext.queryParams,
      isFileReq: FormUIContext.isFileReq,
      setIsFileReq: FormUIContext.setIsFileReq,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    actionsLoading,
    user,
    userForEdit,
    roles,

    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.employee_loan_request.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.employee_loan_request.userForRead,
  }));

  useEffect(() => {
    dispatch(actions.fetchmoduledata(id));

    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, [id, dispatch, show]);

  const saveForm = async (
    data,
    totalInstallments,
    maxAmountLimit,
    setTotalInstallments,
    setMaxAmountLimit,
    setMaxMonthlyAmountSuggest,
    resetForm,
    monthlyInstallmentsLimit,
    setMonthlyInstallmentsLimit,
    subsidiaryid
  ) => {
    // Enable loading if needed
    // enableLoading();

    // Create a new object to avoid mutating the original 'data' object
    const updatedData = {
      ...data, // Spread the original data
      subsidiaryId: subsidiaryid, // Override the subsidiaryId
    };

    // Validate the form based on various conditions
    if (maxAmountLimit < Number(updatedData.total_loan_amount)) {
      disbaleLoading();
      toast.error("Loan amount exceeds the limit.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (monthlyInstallmentsLimit < totalInstallments) {
      disbaleLoading();
      toast.error(
        "The total installments must not exceed monthly installments limit.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else if (
      Number(updatedData.total_loan_amount) <
      Number(updatedData.monthly_installment)
    ) {
      disbaleLoading();
      toast.error("The monthly installment must not exceed loan amount.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!updatedData.Id && updatedData) {
      // Handle creating a new loan request
      formUIProps.setIds("");
      updatedData.total_installment = totalInstallments;
      updatedData.total_loan_amount = Number(updatedData.total_loan_amount);
      updatedData.monthly_installment = Number(updatedData.monthly_installment);
      await dispatch(
        actions.createEmpSalaryRevision(
          updatedData,
          disbaleLoading,
          resetForm
        )
      );
      await dispatch(actions.fetchEmpSalaryRevision(formUIProps));

      // Reset the form and limits
      setTotalInstallments("");
      setMaxAmountLimit("");
      setMaxMonthlyAmountSuggest("");
      setMonthlyInstallmentsLimit("");
    } else {
      // Handle updating an existing loan request
      formUIProps.setIds("");

      const formUpdatedFields = {
        Id: updatedData.Id,
        // employee_loan_accountId: updatedData.employee_loan_accountId,
        // employeeId: updatedData.employeeId,
        // loan_typeId: updatedData.loan_typeId,
        // monthly_installment: updatedData.monthly_installment,
        // applied_date: updatedData.applied_date,
        // installment_start_date: updatedData.installment_start_date,
        // total_loan_amount: updatedData.total_loan_amount,
        // total_installment: totalInstallments,
        // reason: updatedData.reason,
        // loan_amount_remaining: updatedData.total_loan_amount,
        // loan_amount_paid: 0,
        // subsidiaryId: subsidiaryid, // Using the updated value for subsidiaryId
        isLoanContinuing: updatedData.isLoanContinuing,
      };

      await dispatch(
        actions.updateEmpSalaryRevision(
          formUpdatedFields,
          disbaleLoading,
          resetForm
        )
      );
      await dispatch(actions.fetchEmpSalaryRevision(formUIProps));

      // Reset the total installments
      setTotalInstallments("");
    }
  };

  return (
    <>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        roles={roles}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        isFileReq={formUIProps.isFileReq}
        setIsFileReq={formUIProps.setIsFileReq}
        disbaleLoading={disbaleLoading}
        formUIProps={formUIProps}
      />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
