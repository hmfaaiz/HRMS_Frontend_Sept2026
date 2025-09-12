import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormDetailsEditForm";
import { FormEditDialogHeader } from "./FormDetailsEditDialogHeader";
import * as actions from "../../../_redux/formdetailsActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormDetailsUIContext";
export const USERS_URL = process.env.REACT_APP_API_URL;

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const formUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      initUser: formUIContext.initUser,
      queryParams: formUIContext.queryParams,
    };
  }, [formUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.chart_of_accounts.userForEdit,
  }));

  useEffect(() => {
    dispatch(actions.fetchUser(id));
  }, [id, dispatch]);

  const saveReligion = async (user) => {
    if (!id) {
      await dispatch(actions.createform(user, disbaleLoading, onHide));
      await dispatch(actions.customfetchFormDetail(FormUIProps.queryParams));
    } else {
      await dispatch(actions.updateForm(user, disbaleLoading, onHide));
      dispatch(actions.customfetchFormDetail(FormUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="md"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveReligion={saveReligion}
        user={userForEdit || FormUIProps.initUser}
        onHide={onHide}
        loading={loading}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
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
