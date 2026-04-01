import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.t_tada_config.userForEdit,
      actionsLoading: state.t_tada_config.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "Edit TADA Configuration" : "Add TADA Configuration";
    setTitle(_title);
  }, [id, userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {isUserForRead ? "View TADA Configuration" : title}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
