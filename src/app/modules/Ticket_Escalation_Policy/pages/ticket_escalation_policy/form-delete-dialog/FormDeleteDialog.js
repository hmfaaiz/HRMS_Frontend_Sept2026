import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import * as actions from "../../../_redux/redux-Actions";
import { useTicketEscalationPolicyUIContext } from "../FormUIContext";

export function TicketEscalationPolicyDeleteDialog({ id, show, onHide }) {
  const UIContext = useTicketEscalationPolicyUIContext();
  const UIProps = { queryParams: UIContext.queryParams };

  const dispatch = useDispatch();
  const { actionsLoading } = useSelector(
    (state) => ({ actionsLoading: state.ticket_escalation_policy.actionsLoading }),
    shallowEqual
  );

  useEffect(() => {
    if (!id) onHide();
  }, [id, onHide]);

  const deletePolicy = () => {
    if (!id) return;
    dispatch(actions.deleteTicketEscalationPolicy(id)).then(() => {
      dispatch(actions.fetchTicketEscalationPolicies(UIProps.queryParams));
      onHide();
    });
  };

  return (
    <Modal show={show} onHide={onHide} aria-labelledby="delete-tep-modal">
      {actionsLoading && <ModalProgressBar />}
      <Modal.Header closeButton>
        <Modal.Title id="delete-tep-modal">Delete Escalation Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!actionsLoading && <label>Are you sure you want to delete this escalation policy?</label>}
        {actionsLoading && <label>Deleting escalation policy...</label>}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
          Cancel
        </button>
        <button type="button" onClick={deletePolicy} className="btn btn-danger">
          Delete
          {actionsLoading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
        </button>
      </Modal.Footer>
    </Modal>
  );
}