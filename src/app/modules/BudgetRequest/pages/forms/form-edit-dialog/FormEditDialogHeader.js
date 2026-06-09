import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

export function FormEditDialogHeader() {

  const { actionsLoading } = useSelector(

    (state) => ({
      actionsLoading: state.leave_request.actionsLoading,
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
