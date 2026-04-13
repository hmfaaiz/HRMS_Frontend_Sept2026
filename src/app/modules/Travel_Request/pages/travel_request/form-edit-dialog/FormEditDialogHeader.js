import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.travel_request.userForEdit,
      actionsLoading: state.travel_request.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "Edit Travel Request" : "Create Travel Request";
    setTitle(_title);
  }, [id, userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {isUserForRead ? "View Travel Request" : title}
        </Modal.Title>
      </Modal.Header>
    </>
  );

}
