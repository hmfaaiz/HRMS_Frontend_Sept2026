import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

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
  const { userForEdit, roles, userStatusTypes, empAuthorityList } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      user: state.users,
      userForEdit: state.loan_request.userForEdit,
      empAuthorityList: state.loan_request.empAuthorityList,
      roles: state.users.roles,
      userStatusTypes: state.users.userStatusTypes,
    })
  );

  useEffect(() => {
    dispatch(actions.fetchmoduledata(id));
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
      ...data,
      employeeId: data?.employeeId?.value,
      subsidiaryId: subsidiaryid,
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
        actions.createEmployeeLoanRequest(
          { ...updatedData, authortiesList: empAuthorityList },
          disbaleLoading,
          resetForm
        )
      );
      await dispatch(
        actions.fetchEmployeeLoanRequest({
          ...formUIProps.queryParams,
          employeeId: formUIProps.employeeId.value,
        })
      );
      setTotalInstallments("");
      setMaxAmountLimit("");
      setMaxMonthlyAmountSuggest("");
      setMonthlyInstallmentsLimit("");
    } else {
      formUIProps.setIds("");

      const formUpdatedFields = {
        Id: updatedData.Id,
        loan_typeId: updatedData.loan_typeId,
        monthly_installment: Number(updatedData.monthly_installment),
        total_loan_amount: Number(updatedData.total_loan_amount),
        isLoanContinuing: updatedData.isLoanContinuing,
        total_installment: totalInstallments,
      };
      await dispatch(
        actions.updateEmployeeLoanRequest(
          { ...formUpdatedFields, authortiesList: empAuthorityList },
          disbaleLoading,
          resetForm
        )
      );
      await dispatch(
        actions.fetchEmployeeLoanRequest({
          ...formUIProps.queryParams,
          employeeId: formUIProps.employeeId.value,
        })
      );

      // Reset the total installments
      setTotalInstallments("");
    }
  };

  return (
    <>
      {/* <FormEditDialogHeader id={id} isUserForRead={userForRead} /> */}
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
