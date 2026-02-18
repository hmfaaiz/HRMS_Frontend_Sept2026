import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormEditDialogHeader } from "./FormEditDialogHeader";
import { SubsidiaryPayrollFormEditForm } from "./FormEdit";
import * as actions from "../../../_redux/redux-Actions";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";

export function SubsidiaryPayrollFormEditDialog({
  subsidiaryId,
  payroll_groupId,
  show,
  onHide,
  dataForRead,
}) {
  const [loading, setLoading] = useState(false);
  const uiContext = useSubsidiaryPayrollUIContext();

  const formUIProps = useMemo(
    () => ({ queryParams: uiContext.queryParams }),
    [uiContext.queryParams]
  );

  const dispatch = useDispatch();

  const { dataForEdit } = useSelector(
    (state) => ({
      dataForEdit: state.subsidiary_wise_payroll_checklist.dataForEdit,
    }),
    shallowEqual
  );

  const transformedData = useMemo(() => {
  if (!dataForEdit) {
    return {
      subsidiaryId: "",
      payroll_groupId: "",
      list: [],
      dataIsExist: false,
    };
  }
  return {
    subsidiaryId: dataForEdit.subsidiaryId || "",
    payroll_groupId: dataForEdit.payroll_groupId !== undefined 
      ? dataForEdit.payroll_groupId 
      : "",
    list: dataForEdit.list || [],
    dataIsExist: dataForEdit.dataIsExist || false,
  };
}, [dataForEdit]);

 useEffect(() => {
  //subsidiaryId must exist, but payroll_groupId can be null (means "All")
  if (subsidiaryId && payroll_groupId !== undefined && show) {
    dispatch(actions.fetchPayrollChecklistForEdit(subsidiaryId, payroll_groupId));
  }
  return () => {
    if (!show) {
      dispatch(actions.fetchPayrollChecklistForEdit(null, undefined));
    }
  };
}, [subsidiaryId, payroll_groupId, show, dispatch]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const saveForm = async (data) => {
    try {
      enableLoading();

      // Upload attachments
      const updatedList = await Promise.all(
        data.list.map(async (e) => {
          let attachmentPath = e.attachmentPath;

          if (e.attachment) {
            const res = await actions.uploadImage(e.attachment);
            attachmentPath = res.data.filename;
          }

          return {
            ...e,
            attachmentPath: Array.isArray(attachmentPath)
              ? attachmentPath[0] || null
              : attachmentPath || null,
          };
        })
      );

      const finalData = { ...data, list: updatedList };

      // Decide create or update
      const action = data.dataIsExist
        ? actions.updatePayrollChecklistAction
        : actions.createPayrollChecklistAction;

      await dispatch(action(finalData, disableLoading, onHide));

      // Refresh table
      await dispatch(actions.fetchPayrollChecklist(formUIProps.queryParams));
    } catch (error) {
      console.error("Save form failed:", error);
      disableLoading();
    }
  };

  return (
    <Modal size="xl" show={show} onHide={onHide} aria-labelledby="modal-title">
      <FormEditDialogHeader
        id={subsidiaryId}
        isDataForRead={dataForRead}
        title="Payroll Checklist (Subsidiary)"
      />
      <SubsidiaryPayrollFormEditForm
        saveForm={saveForm}
        data={transformedData}
        onHide={onHide}
        isDataForRead={dataForRead}
        loading={loading}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </Modal>
  );
}