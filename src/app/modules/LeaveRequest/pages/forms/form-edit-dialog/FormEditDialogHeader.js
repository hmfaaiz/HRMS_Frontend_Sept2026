import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader() {

  const { actionsLoading } = useSelector(

    (state) => ({
      userForEdit: state.leave_application.userForEdit,
      actionsLoading: state.users.actionsLoading,
    }),
    shallowEqual
  );

  return (
    <>
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          Leave Entry
        </Modal.Title>
      </Modal.Header>
    </>
  );
}
