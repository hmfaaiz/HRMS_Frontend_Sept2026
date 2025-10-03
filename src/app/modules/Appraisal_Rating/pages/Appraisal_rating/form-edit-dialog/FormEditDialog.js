import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
      fetchSubsidiaryId: FormUIContext.fetchSubsidiaryId,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit } = useSelector((state) => ({
    userForEdit: state.appraisal_rating.userForEdit,
  }));

  useEffect(() => {
    dispatch(actions.fetchAppraisalRatingById(id));
  }, [id, dispatch]);

  const saveForm = async (user) => {
    if (!id) {
      user.subsidiaryId = formUIProps?.fetchSubsidiaryId;
      await dispatch(
        actions.createAppraisalRating(user, disbaleLoading, onHide)
      );
      await dispatch(actions?.fetchAppraisalRatings(formUIProps?.queryParams));
    } else {
      const formUpdatedFields = {
        ...user,
      };

      await dispatch(
        actions?.updateAppraisalRating(
          formUpdatedFields,
          disbaleLoading,
          onHide
        )
      );
      await dispatch(actions?.fetchAppraisalRatings(formUIProps?.queryParams));
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
        enableLoading={enableLoading}
        loading={loading}
        subsidiaryId={formUIProps?.fetchSubsidiaryId}
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
