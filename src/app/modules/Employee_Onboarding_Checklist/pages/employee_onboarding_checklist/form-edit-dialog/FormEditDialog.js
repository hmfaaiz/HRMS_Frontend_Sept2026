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

  const saveForm = async (data) => {
    if (!Id) {
      await dispatch(
        actions.createEmployeeChecklist(data, disableLoading, onHide),
      );
      await dispatch(
        actions.fetchEmployeeOnboardingChecklist(formUIProps.queryParams),
      );
    } else {
      await dispatch(
        actions.updateEmployeeChecklist(data, disableLoading, onHide),
      );
      await dispatch(
        actions.fetchEmployeeOnboardingChecklist(formUIProps.queryParams),
      );
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