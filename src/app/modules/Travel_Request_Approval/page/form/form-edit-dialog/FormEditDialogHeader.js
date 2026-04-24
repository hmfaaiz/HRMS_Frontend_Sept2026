import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit: state.travel_approval?.userForEdit,
      actionsLoading: state.travel_approval?.actionsLoading,
    }),
    shallowEqual,
  );

  useEffect(() => {
    let _title = id
      ? "Process Travel Request"
      : "Travel Request Details";
    setTitle(_title);
  }, [id, userForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {isUserForRead ? "View Travel Request Details" : title}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
