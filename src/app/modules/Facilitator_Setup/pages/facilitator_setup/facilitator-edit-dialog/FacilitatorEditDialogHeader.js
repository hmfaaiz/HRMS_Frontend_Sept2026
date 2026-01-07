import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal, ModalProgressBar } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FacilitatorEditDialogHeader({ id, isDataForRead }) {
  const [title, setTitle] = useState("");

  const { facilitatorForEdit, actionsLoading } = useSelector(
    (state) => ({
      facilitatorForEdit: state.facilitator.facilitatorForEdit,
      actionsLoading: state.facilitator.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "Edit Facilitator" : "Add Facilitator";
    if (isDataForRead) _title = "View Facilitator";
    setTitle(_title);
  }, [id, isDataForRead, facilitatorForEdit, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="facilitator-edit-dialog-title-lg">
          {title}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}


