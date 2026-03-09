import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead, isNew }) {
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
    userForEdit: state.geo_location.userForEdit,
    actionsLoading: state.geo_location.actionsLoading,
  }));

  useEffect(() => {
    dispatch(actions.fetchGeoLocationById(id));
  }, [id, dispatch]);

  const saveForm = async (user) => {
   
    await dispatch(actions.updateGeoLocation(user, disbaleLoading, onHide));
    await dispatch(actions.fetchGeoLocations(formUIProps.queryParams));
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
        user={id ? userForEdit : formUIProps.initUser}
        isNew={isNew}
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
