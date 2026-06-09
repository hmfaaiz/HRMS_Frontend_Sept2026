import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.ai_api_configuration.userForEdit,
      actionsLoading: state.ai_api_configuration.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "" : "Add AI Api Configuration";
    if (id) {
      _title = `Edit AI Api Configuration`;
    }
    setTitle(_title);
  }, [userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View AI Api Configuration"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
