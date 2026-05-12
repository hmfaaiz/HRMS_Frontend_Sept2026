import React from "react";
import { Modal } from "react-bootstrap";

export function ConfirmationDialog({
  show,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <label>{message}</label>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="btn btn-light btn-elevate"
          onClick={onCancel}
        >
          {cancelText}
        </button>

        <button type="button" className="btn btn-primary" onClick={onConfirm}>
          {confirmText}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
