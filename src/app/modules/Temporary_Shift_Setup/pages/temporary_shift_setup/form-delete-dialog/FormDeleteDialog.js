import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";

export function FormDeleteDialog({ id, show, onHide }) {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.temporary_shift_setup.actionsLoading,
    }),
    shallowEqual
  );

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  useEffect(() => {
    if (!id) onHide();
  }, [id]);

  const deleteRecord = () => {
    enableLoading();
    dispatch(actions.deleteRecord(id, disableLoading, onHide));
  };

  return (
    <Modal show={show} onHide={onHide}>
      {isLoading && <ModalProgressBar />}

      <Modal.Header closeButton>
        <Modal.Title>Delete Temporary Shift</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!isLoading && (
          <label>Are you sure you want to delete this record?</label>
        )}
        {isLoading && <label>Deleting...</label>}
      </Modal.Body>

      <Modal.Footer>
        <button onClick={onHide} className="btn btn-light">
          Cancel
        </button>

        <button onClick={deleteRecord} className="btn btn-danger">
          Delete
          {loading && <span className="ml-3 spinner spinner-white"></span>}
        </button>
      </Modal.Footer>
    </Modal>
  );
}