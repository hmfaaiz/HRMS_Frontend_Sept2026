// pages/Bonus_Policy/form-edit-dialog/FormEditDialog.jsx
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

  const enableLoading = () => setLoading(true);
  const disbaleLoading = () => setLoading(false);

  const dispatch = useDispatch();
  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.bonus_policy.userForEdit,
  }));

  useEffect(() => {
    dispatch(actions.fetchBonusPolicyById(id));
  }, [id, dispatch]);

  const saveForm = async (values) => {
    if (!id) {
      await dispatch(actions.createBonusPolicy(values, disbaleLoading, onHide));
      await dispatch(actions.fetchBonusPolicy(formUIProps.queryParams));
    } else {
      await dispatch(actions.updateBonusPolicy(values, disbaleLoading, onHide));
      await dispatch(actions.fetchBonusPolicy(formUIProps.queryParams));
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
        savePolicy={saveForm}
        data={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
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
