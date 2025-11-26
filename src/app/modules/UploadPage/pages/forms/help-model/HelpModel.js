import React from "react";
import { Modal } from "react-bootstrap";

export function FormHelpModel({ descrption, show, onHide, title }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      {/*begin::Loading*/}
      {/*end::Loading*/}
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {title} Info
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>{descrption}</label>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light btn-elevate"
          >
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
