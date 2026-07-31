import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg" className="text-bold">
          {!isUserForRead ? "" : "View Bonus Process"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}