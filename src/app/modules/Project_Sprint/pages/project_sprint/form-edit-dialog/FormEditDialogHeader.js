import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    let _title = id ? "Edit Project Sprint" : "Create Project Sprint";
    setTitle(_title);
  }, [id]);

  return (
    <Modal.Header closeButton className="d-flex align-items-center">
      <Modal.Title className="m-0">
        {isUserForRead ? "View Project Sprint" : title}
      </Modal.Title>
    </Modal.Header>
  );
}
