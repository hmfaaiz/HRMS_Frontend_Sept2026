import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isDataForRead, title }) {
  const [headerTitle, setHeaderTitle] = useState("");

  const { actionsLoading, dataForEdit } = useSelector(
    (state) => ({
      dataForEdit: state.subsidiary_wise_payroll_checklist.dataForEdit,
      actionsLoading: state.subsidiary_wise_payroll_checklist.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? `Edit ${title}` : `Add ${title}`;
    if (isDataForRead) _title = `View ${title}`;
    setHeaderTitle(_title);
  }, [id, dataForEdit, isDataForRead, title]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="modal-title">{headerTitle}</Modal.Title>
      </Modal.Header>
    </>
  );
}
