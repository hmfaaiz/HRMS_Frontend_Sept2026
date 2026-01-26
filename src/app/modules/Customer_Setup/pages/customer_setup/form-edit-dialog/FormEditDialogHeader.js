import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
export function CustomerEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    let _title = id ? "Edit Customer" : "New Customer";
    setTitle(_title);
  }, [id]);

  return (
    <Modal.Header closeButton className="d-flex align-items-center">
      <Modal.Title className="m-0">
        {isUserForRead ? "View Customer" : title}
      </Modal.Title>
    </Modal.Header>
  );
}
