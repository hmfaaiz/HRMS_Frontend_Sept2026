import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isdataForRead, title }) {
  const [headerTitle, setHeaderTitle] = useState("");

  const { actionsLoading, dataForEdit } = useSelector(
    (state) => ({
      dataForEdit: state.onboarding_checklist.dataForEdit,
      actionsLoading: state.onboarding_checklist.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? `Edit ${title}` : `Add ${title}`;
    if (isdataForRead) _title = `View ${title}`;
    setHeaderTitle(_title);
  }, [id, dataForEdit, isdataForRead, title]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="modal-title">{headerTitle}</Modal.Title>
      </Modal.Header>
    </>
  );
}
