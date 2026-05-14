import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.interview_questionnaire.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "Edit Interview Questionnaire" : "Add Interview Questionnaire";
    setTitle(_title);
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Interview Questionnaire"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}