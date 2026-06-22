import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SubsidiaryOnboardingFormEditForm } from "./FormEdit";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";

export function SubsidiaryOnboardingEditDialog({
  id,
  show,
  onHide,
  dataForRead,
}) {
  const [loading, setLoading] = useState(false);
  const uiContext = useSubsidiaryOnboardingUIContext();

  const formUIProps = useMemo(
    () => ({
      queryParams: uiContext.queryParams,
    }),
    [uiContext.queryParams],
  ); // Add dependency

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();

  const { dataForEdit } = useSelector(
    (state) => ({
      dataForEdit: state.onboarding_checklist.dataForEdit,
    }),
    shallowEqual,
  );


  const transformedData = useMemo(() => {
    if (!dataForEdit) return { list: [], subsidiaryId: "", dataIsExist: false };

    return {
      subsidiaryId: dataForEdit.subsidiaryId,
      list: dataForEdit.list || [],
      dataIsExist: dataForEdit.dataIsExist || false,
    };
  }, [dataForEdit]);

  // Only fetch when id changes and exists
  useEffect(() => {
    if (id && show) {
      dispatch(actions.fetchSubsidiaryChecklistForEditBySubsidiaryId(id));
    }
    return () => {
      if (!show) {
        dispatch(actions.fetchSubsidiaryChecklistForEditBySubsidiaryId(null));
      }
    };
  }, [id, show, dispatch]);
  const saveForm = async (data) => {
    try {
      enableLoading();

      // Upload attachments in parallel and build updated list
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
        : attachmentPath || null
    };
  })
);


      const finalData = { ...data, list: updatedList };

      // Create or update checklist
      const action = data.dataIsExist
        ? actions.updateSubsidiaryChecklistAction
        : actions.createSubsidiaryChecklistAction;

      await dispatch(action(finalData, disableLoading, onHide));

      // Refresh list
      await dispatch(actions.fetchSubsidiaryChecklist(formUIProps.queryParams));
    } catch (error) {
      console.error("Save form failed:", error);
      disableLoading();
    }
  };

  return (
    <Modal size="xl" show={show} onHide={onHide} aria-labelledby="modal-title">
      <FormEditDialogHeader
        id={id}
        isdataForRead={dataForRead}
        title="Onboarding Checklist (Subsidiary)"
      />
      {/* <SubsidiaryOnboardingFormEditForm
        saveForm={saveForm}
        data={dataForEdit || {}}
        onHide={onHide}
        isDataForRead={dataForRead}
        loading={loading}
        enableLoading={enableLoading}
      /> */}
      <SubsidiaryOnboardingFormEditForm
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
