import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TicketEscalationPolicyEditForm } from "./FormEdit";
import { useTicketEscalationPolicyUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";

export function TicketEscalationPolicyEditDialog({ id, show, onHide, status, dataForRead }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const UIContext = useTicketEscalationPolicyUIContext();
  const UIProps = useMemo(() => ({
    queryParams: UIContext.queryParams,
    initTicketEscalationPolicy: UIContext.initTicketEscalationPolicy,
  }), [UIContext]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const { policyForEdit, actionsLoading } = useSelector(
    (state) => ({
      policyForEdit: state.ticket_escalation_policy?.ticketEscalationPolicyForEdit,
      actionsLoading: state.ticket_escalation_policy?.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (status === "edit" || status === "read") {
      if (id) dispatch(actions.fetchTicketEscalationPolicy(id));
    } else {
      dispatch(actions.clearTicketEscalationPolicyData());
    }
  }, [id, status, dispatch]);


  const savePolicy = async (formData) => {
    enableLoading();
    try {
      const targetId = formData.Id || id;

      if (targetId) {
        await dispatch(
          actions.updateTicketEscalationPolicy(
            { ...formData, Id: targetId },
            disableLoading,
            onHide
          )
        );
      } else {
        await dispatch(
          actions.createTicketEscalationPolicy(formData, disableLoading, onHide)
        );
      }

      await dispatch(actions.fetchTicketEscalationPolicies(UIProps.queryParams));
    } catch (err) {
      console.error("Escalation policy save failed:", err);
      disableLoading();
    }
  };

  const initialValues = policyForEdit || UIProps.initTicketEscalationPolicy || {};
  const dataLoaded = status === "new" || policyForEdit;
  const isReadOnly = dataForRead || status === "read";

  const getTitle = () => {
    if (isReadOnly) return "View Escalation Policy";
    if (status === "edit") return "Edit Escalation Policy";
    return "Add Escalation Policy";
  };

  return (
    <Modal
      size="xl"
      dialogClassName="tep-modal-wide"
      show={show}
      onHide={onHide}
      aria-labelledby="tep-edit-dialog"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{getTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="overlay overlay-block cursor-default">
        {actionsLoading && (
          <div className="overlay-layer bg-transparent">
            <div className="spinner spinner-lg spinner-success" />
          </div>
        )}

        {dataLoaded ? (
          <TicketEscalationPolicyEditForm
            savePolicy={savePolicy}
            data={initialValues}
            onHide={onHide}
            isUserForRead={isReadOnly}
            loading={loading}
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center p-5">
            <span className="spinner spinner-lg spinner-success"></span>
          </div>
        )}
      </Modal.Body>

      <ToastContainer position="top-right" autoClose={5000} />
    </Modal>
  );
}