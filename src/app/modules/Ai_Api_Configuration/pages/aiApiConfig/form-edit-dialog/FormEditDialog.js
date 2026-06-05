import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

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

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit, actionsLoading } = useSelector((state) => ({
    userForEdit: state.ai_api_configuration.userForEdit,
    actionsLoading: state.ai_api_configuration.actionsLoading,
  }));

  useEffect(() => {
    dispatch(actions.fetchAiApiConfiguration(id));
  }, [id, dispatch]);

  const saveForm = async (user) => {
    if (!id) {
      await dispatch(actions.createAiApiConfiguration(user, disbaleLoading, onHide));
      await dispatch(actions.fetchAiApiConfigurations(formUIProps.queryParams));
    } else {
      await dispatch(actions.updateAiApiConfiguration(user, disbaleLoading, onHide));
      await dispatch(actions.fetchAiApiConfigurations(formUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        actionsLoading={actionsLoading}
        enableLoading={enableLoading}
        loading={loading}
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
