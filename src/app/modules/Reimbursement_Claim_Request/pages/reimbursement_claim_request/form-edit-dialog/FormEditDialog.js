import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { FormEditForm } from "./FormEditForm";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, employeeId }) {
  const [loading, setLoading] = useState(false);
  const [isFileReq, setIsFileReq] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      setIds: FormUIContext.setIds,
      employeeId: FormUIContext.employeeId,
    };
  }, [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disbaleLoading = () => setLoading(false);

  const dispatch = useDispatch();

  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.reimbursement_claim_request.userForEdit,
  }));

  useEffect(() => {
    dispatch(actions.fetchmoduledata(id));
  }, [id, dispatch]);

  const saveForm = async (payload, finalAmountLimit, fileReq, clearForm) => {
    const updatedData = {
      ...payload,
      employeeId: payload?.employeeId?.value || formUIProps.employeeId?.value,
      subsidiaryId: payload?.subsidiaryId,
    };

    // Validate amount limit
    if (
      finalAmountLimit !== null &&
      finalAmountLimit !== undefined &&
      Number(updatedData.amount) > finalAmountLimit
    ) {
      disbaleLoading();
      return;
    }

    if (!updatedData.Id) {
      // ── CREATE ────
      formUIProps.setIds("");
      await dispatch(
        actions.createReimbursementClaim(
          updatedData, 
          disbaleLoading,
          clearForm
        )
      );
      await dispatch(
        actions.fetchReimbursementClaim({
          ...formUIProps.queryParams,
          employeeId: formUIProps.employeeId.value,
        })
      );
    } else {
      // ── UPDATE ────
      formUIProps.setIds("");
      const updateFields = {
        Id: updatedData.Id,
        reimbursement_typeId: updatedData.reimbursement_typeId,
        amount: Number(updatedData.amount),
        details: updatedData.details,
        date: updatedData.date,
        file: updatedData.file,
        pay_in_payroll_forId: updatedData.pay_in_payroll_forId,
        authortiesList: updatedData.authortiesList, 
      };
      await dispatch(
        actions.updateReimbursementClaim(updateFields, disbaleLoading, clearForm)
      );
      await dispatch(
        actions.fetchReimbursementClaim({
          ...formUIProps.queryParams,
          employeeId: formUIProps.employeeId.value,
        })
      );
    }
  }; 

  return (
    <div className="px-3 py-2 w-full bg-white rounded-lg">
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        enableLoading={enableLoading}
        loading={loading}
        disbaleLoading={disbaleLoading}
        setIds={formUIProps.setIds}
        isEdit={!!id}
        isFileReq={isFileReq}
        setIsFileReq={setIsFileReq}
        formUIProps={formUIProps}
        employeeId={formUIProps.employeeId?.value}
      />
    </div>
  );
}