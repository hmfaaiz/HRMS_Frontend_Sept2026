import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

export function TicketStatusEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    let _title = id ? "Edit Ticket Status" : "New Ticket Status";
    setTitle(_title);
  }, [id]);

  return (
    <Modal.Header closeButton className="d-flex align-items-center">
      <Modal.Title className="m-0">
        {isUserForRead ? "View Ticket Status" : title}
      </Modal.Title>
    </Modal.Header>
  );
}
