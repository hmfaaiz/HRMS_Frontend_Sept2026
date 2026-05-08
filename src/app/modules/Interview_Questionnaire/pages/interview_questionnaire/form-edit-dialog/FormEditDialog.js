import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const usersUIProps = useMemo(() => ({
    queryParams: FormUIContext.queryParams,
  }), [FormUIContext]);

  const formUIProps = useMemo(() => ({
    initUser: FormUIContext.initUser,
    queryParams: FormUIContext.queryParams,
  }), [FormUIContext]);

  const enableLoading = () => setLoading(true);
  const disbaleLoading = () => setLoading(false);

  const dispatch = useDispatch();

  const { actionsLoading, userForEdit } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
      userForEdit: state.interview_questionnaire.userForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchInterviewQuestionnaire(id));
  }, [id, dispatch]);

  const saveForm = async (data) => {
  if (!id) {
    dispatch(actions.createInterviewQuestionnaire(
      data,
      disbaleLoading,
      onHide,
      usersUIProps.queryParams 
    ));
  } else {
    const updatedFields = {
      Id: data.Id,
      topic: data.topic,
      question: data.question,
      subsidiaryId: data.subsidiaryId,
      departmentId: data.departmentId,
      designationId: data.designationId,
      isAllowRatingSelection: data.isAllowRatingSelection,
      isActive: data?.isActive,
    };
    await dispatch(actions.updateInterviewQuestionnaire(
      updatedFields,
      disbaleLoading,
      onHide,
      usersUIProps.queryParams 
    ));
  }
};

  return (
    <Modal size="lg" show={show} onHide={onHide} aria-labelledby="example-modal-sizes-title-lg">
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <FormEditForm
        saveForm={saveForm}
        data={userForEdit || formUIProps.initUser}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
      />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}
        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Modal>
  );
}