import React, { useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useTicketStatusUIContext } from "../FormUIContext";

export function TicketStatusDeleteDialog({ id, show, onHide }) {
  const dispatch = useDispatch();
  const ticketStatusUIContext = useTicketStatusUIContext();

  const ticketStatusUIProps = useMemo(() => ({
    queryParams: ticketStatusUIContext.queryParams,
  }), [ticketStatusUIContext]);

  const { isLoading } = useSelector(
    (state) => ({
      isLoading: state.ticketStatus?.actionsLoading,
    }),
    shallowEqual
  );

  const deleteTicketStatus = () => {
    dispatch(actions.deleteTicketStatus(id)).then(() => {
      onHide();
      dispatch(actions.fetchTicketStatuses(ticketStatusUIProps.queryParams));
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Ticket Status</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}
        <span>Are you sure you want to permanently delete this ticket status?</span>
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
          onClick={deleteTicketStatus}
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
