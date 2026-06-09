import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { actionsLoading } = useSelector(
    (state) => ({
      actionsLoading: state.budget_year_setup.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    let _title = id ? "Edit Budget Year Setup" : "Add Budget Year Setup";
    setTitle(_title);
  }, [id, actionsLoading]);

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {!isUserForRead ? title : "View Budget Year Setup"}
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
