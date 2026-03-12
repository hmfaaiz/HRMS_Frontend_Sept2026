import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";

export function FormDeleteDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(
    () => ({
      queryParams: formUIContext.queryParams,
    }),
    [formUIContext],
  );

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.customer_config?.actionsLoading,
    }),
    shallowEqual,
  );

  const deleteRecord = () => {
    dispatch(actions.deleteCustomerConfig(id)).then(() => {
      onHide();
      dispatch(actions.fetchCustomerConfigs(formUIProps.queryParams));
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Record Delete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}
        <span>Are you sure you want to permanently delete this record?</span>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={deleteRecord}
          className="btn btn-danger btn-elevate"
          disabled={isLoading}
        >
          Delete
          {isLoading && <span className="ml-3 spinner spinner-white" />}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
