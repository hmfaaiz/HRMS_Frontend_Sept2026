import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.temporary_shift_setup.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id
      ? "Edit Temporary Shift Setup"
      : "Add Temporary Shift Setup";
    setTitle(_title);
  }, [id]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title>
          {!isUserForRead ? title : "View Temporary Shift Setup"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}