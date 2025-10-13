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
  const { userForEdit, ratingSelection, ratingDetail } = useSelector(
    (state) => ({
      userForEdit: state.appraisal_evaluation.userForEdit,
      ratingSelection: state.appraisal_evaluation.ratingSelection,
      ratingDetail: state.appraisal_evaluation.ratingDetail,
    })
  );

  useEffect(() => {
    dispatch(actions.fetchAppraisalEvaluationById(id));
  }, [id, dispatch]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        onHide={onHide}
        isUserForRead={userForRead}
        ratingDetail={ratingDetail}
        ratingSelection={ratingSelection}
        enableLoading={enableLoading}
        loading={loading}
        setLoading={setLoading}
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
