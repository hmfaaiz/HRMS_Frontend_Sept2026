import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { fetchEmployeeChecklistByEmployee } from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEmployeeOnboardingUIContext } from "../FormUIContext";

export function FormEditDialog({ show, Id, onHide, dataForRead }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const FormUIContext = useEmployeeOnboardingUIContext();

  const formUIProps = useMemo(
    () => ({
      queryParams: FormUIContext.queryParams,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    }),
    [FormUIContext],
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { dataForEdit } = useSelector(
    (state) => ({
      dataForEdit: state.employee_onboarding_checklist.dataForEdit,
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (Id) {
      dispatch(fetchEmployeeChecklistByEmployee(Id));
    }
  }, [Id, dispatch, show]);

  // Upload attachments before saving
  const saveForm = async (data) => {
    try {
      enableLoading();

      console.log('Data before upload:', data);

      // Upload all file attachments first
      const updatedList = await Promise.all(
        (data.list || []).map(async (item) => {
          let attachmentPath = item.attachmentPath;

          // If there's a new file to upload
          if (item.attachment && item.attachment instanceof File) {
            try {
              console.log(`Uploading file for task: ${item.taskName}`, item.attachment.name);
              const res = await actions.uploadImage(item.attachment);
              attachmentPath = res.data.filename;
              console.log(`Upload successful:`, attachmentPath);
            } catch (error) {
              console.error(`Failed to upload file for ${item.taskName}:`, error);
              // Keep existing attachmentPath if upload fails
            }
          }

          // Remove the attachment field and return cleaned object
          const { attachment, ...rest } = item;
          return {
            ...rest,
            attachmentPath: attachmentPath || null,
          };
        })
      );

      const finalData = {
        ...data,
        list: updatedList,
      };

      console.log('Final data being sent:', finalData);

      // Save the data
      if (!Id) {
        await dispatch(
          actions.createEmployeeChecklist(finalData, disableLoading, onHide),
        );
      } else {
        await dispatch(
          actions.updateEmployeeChecklist(finalData, disableLoading, onHide),
        );
      }

      // Refresh the list
      await dispatch(
        actions.fetchEmployeeOnboardingChecklist(formUIProps.queryParams),
      );
    } catch (error) {
      console.error("Save form failed:", error);
      disableLoading();
    }
  };

  const emptyForm = {
    employeeId: "",
    list: [],
    dataIsExist: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (Id) {
      dispatch(fetchEmployeeChecklistByEmployee(Id));
    } else {
      setFormData(emptyForm);
    }
  }, [Id, dispatch, show]);

  useEffect(() => {
    if (Id && dataForEdit) {
      setFormData({
        ...dataForEdit,
        dataIsExist: true,
      });
    }
  }, [Id, dataForEdit]);

  return (
    <Modal size="xl" show={show} onHide={onHide}>
      <FormEditDialogHeader Id={Id} isdataForRead={dataForRead} />
      <FormEditForm
        saveForm={saveForm}
        data={formData}
        onHide={onHide}
        isdataForRead={dataForRead}
        enableLoading={enableLoading}
        loading={loading}
        setPanelMode={formUIProps.setPanelMode}
        panelMode={formUIProps.panelMode}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  );
}