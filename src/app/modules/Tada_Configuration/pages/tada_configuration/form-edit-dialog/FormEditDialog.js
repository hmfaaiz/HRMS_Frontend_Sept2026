import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.t_tada_config?.userForEdit,
  }), shallowEqual);

  useEffect(() => {
    if (show) {
      dispatch(actions.fetchTadaConfig(id));
    }
  }, [id, dispatch, show]);

  const saveForm = async (values) => {
    enableLoading();
    
    // Transform data for backend (picking first selection as a Number for strict backend validation)
    const payload = {
      ...values,
      modeOfTransportId: Number(values.modeOfTransportIds?.[0]?.value) || 0,
      hotelEntitlementId: Number(values.hotelEntitlementIds?.[0]?.value) || 0,
      gradeId: values.gradeId ? Number(values.gradeId) : null,
      designationId: values.designationId ? Number(values.designationId) : null,
    };

    // Remove multi-select helper fields not allowed by the backend
    delete payload.modeOfTransportIds;
    delete payload.hotelEntitlementIds;

    if (!payload.id) {
      dispatch(actions.createTadaConfig(payload, disableLoading, onHide));
    } else {
      await dispatch(actions.updateTadaConfig(payload, disableLoading, onHide));
      await dispatch(actions.fetchTadaConfigs(formUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
      backdrop="static"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        disableLoading={disableLoading}
        id={id}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Modal>
  );
}
