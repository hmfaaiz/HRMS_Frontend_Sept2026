import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
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
  const disableLoading = () => setLoading(false);

  const dispatch = useDispatch();

  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.temporary_shift_setup.userForEdit,
  }));

  useEffect(() => {
    dispatch(actions.fetchEditRecord(id));
  }, [id, dispatch, show]);

  const submitForm = (values) => {
    dispatch(actions.saveRecord(values, id, disableLoading, onHide));
  };

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />

      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
      />

      <ToastContainer />
    </Modal>
  );
}