import React, { useState, useEffect, useMemo } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, userForRead, revisedDate }) {

  const [loading, setLoading] = useState(false);

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
    userForEdit,
    isuserForRead,
  } = useSelector((state) => ({

    userForEdit: state.emp_salary_revision.userForEdit,
    isuserForRead: state.emp_salary_revision.userForRead,
  }));

  useEffect(() => {
    // dispatch(actions.fetchmoduledata(id));
    dispatch(actions.fetchEmpForSalaryRevision());

    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, []);


  useEffect(() => {
    // dispatch(actions.fetchmoduledata(id));
    if (userForEdit?.employeeId) {
      dispatch(actions.fetchAllPrevSalaryRevByEmpId({
        ...usersUIProps.queryParams,
        employeeId: userForEdit?.employeeId
      }));

    }


    // dispatch(actions.fetchmoduledata(formUIProps .queryParams))
  }, [userForEdit?.employeeId,formUIProps.queryParams, dispatch,]);

  const saveForm = async (data, defMapEarningDeductionList) => {

    if (data.revisedDate === null || data.revisedDate === undefined) {
      toast.error("Please select a revised date");
      return;
    }

    const updatedData = {
      ...data,
      EmpSalEarDeducChild: defMapEarningDeductionList,
    };
    // const updatedData = {
    //   ...data, // Spread the original data
    //   subsidiaryId: subsidiaryid, // Override the subsidiaryId
    // };


    // Handle updating an existing loan request
    // formUIProps.setIds("");

    // const formUpdatedFields = {
    //   Id: updatedData.Id,
    //   // employee_loan_accountId: updatedData.employee_loan_accountId,
    //   // employeeId: updatedData.employeeId,
    //   // loan_typeId: updatedData.loan_typeId,
    //   // monthly_installment: updatedData.monthly_installment,
    //   // applied_date: updatedData.applied_date,
    //   // installment_start_date: updatedData.installment_start_date,
    //   // total_loan_amount: updatedData.total_loan_amount,
    //   // total_installment: totalInstallments,
    //   // reason: updatedData.reason,
    //   // loan_amount_remaining: updatedData.total_loan_amount,
    //   // loan_amount_paid: 0,
    //   // subsidiaryId: subsidiaryid, // Using the updated value for subsidiaryId
    //   isLoanContinuing: updatedData.isLoanContinuing,
    // };

    // await dispatch(
    //   actions.updateEmpSalaryRevision(
    //     formUpdatedFields,
    //     disbaleLoading,
    //     resetForm
    //   )
    // );
    await dispatch(actions.createEmpSalaryRev(updatedData));


  }


  return (
    <>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}


        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        setIds={formUIProps.setIds}
        isEdit={id ? true : false}
        isFileReq={formUIProps.isFileReq}
        setIsFileReq={formUIProps.setIsFileReq}
        disbaleLoading={disbaleLoading}
        formUIProps={formUIProps}
        revisedDate={revisedDate}
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
};
