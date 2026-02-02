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
      employeeId: formUIContext.employeeId,
    }),
    [formUIContext],
  );

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.ticket_setup?.actionsLoading,
    }),
    shallowEqual,
  );

  const deleteRecord = () => {
    dispatch(actions.deleteTimeLog(id)).then(() => {
      onHide();
      dispatch(
        actions.fetchTimeLogs({
          ...formUIProps.queryParams,
          filter: {
            ...formUIProps.queryParams?.filter,
            employeeId: formUIProps?.employeeId,
          },
        }),
      );
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
