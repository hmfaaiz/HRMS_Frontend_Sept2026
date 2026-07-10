import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TicketEscalationPolicyUIProvider } from "./FormUIContext";
import { TicketEscalationPolicyEditDialog } from "./form-edit-dialog/FormEditDialog";
import { TicketEscalationPolicyCard } from "./form-card/FormCard";
import { fetchTicketEscalationPolicies } from "../../_redux/redux-Actions";
import { TicketEscalationPolicyDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function TicketEscalationPolicyPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const newMatch = useRouteMatch(
    "/ticket_escalation_policy/read-all-ticket-escalation-policy/new"
  );
  const editMatch = useRouteMatch(
    "/ticket_escalation_policy/read-all-ticket-escalation-policy/:id/edit"
  );
  const readMatch = useRouteMatch(
    "/ticket_escalation_policy/read-all-ticket-escalation-policy/:id/read"
  );
  const deleteMatch = useRouteMatch(
    "/ticket_escalation_policy/read-all-ticket-escalation-policy/:id/:status/delete"
  );

  useEffect(() => {
    dispatch(fetchTicketEscalationPolicies({ pageNumber: 1, pageSize: 50 }));
  }, [dispatch]);

  const TicketEscalationPolicyUIEvents = {
    newTicketEscalationPolicyButtonClick: () => {
      history.push("/ticket_escalation_policy/read-all-ticket-escalation-policy/new");
    },
    openEditTicketEscalationPolicyDialog: (id) => {
      history.push(`/ticket_escalation_policy/read-all-ticket-escalation-policy/${id}/edit`);
    },
    openReadTicketEscalationPolicyDialog: (id) => {
      history.push(`/ticket_escalation_policy/read-all-ticket-escalation-policy/${id}/read`);
    },
    openDeleteTicketEscalationPolicyDialog: (id) => {
      history.push(`/ticket_escalation_policy/read-all-ticket-escalation-policy/${id}/active/delete`);
    },
  };

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess["ticket_escalation_policy"] || [],
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find((item) => item.componentName === "UpdateTicketEscalationPolicy");
  const accessUser = userAccess?.find((item) => item.componentName === "CreateTicketEscalationPolicy");
  const isAccessForDelete = userAccess?.find((item) => item.componentName === "DeleteTicketEscalationPolicy");

  return (
    <TicketEscalationPolicyUIProvider TicketEscalationPolicyUIEvents={TicketEscalationPolicyUIEvents}>
      {/* NEW */}
      {newMatch && accessUser && (
        <TicketEscalationPolicyEditDialog
          show={true}
          status="new"
          onHide={() => history.push("/ticket_escalation_policy/read-all-ticket-escalation-policy")}
          dataForRead={false}
        />
      )}

      {/* EDIT */}
      {editMatch && isAccessForEdit && (
        <TicketEscalationPolicyEditDialog
          show={true}
          status="edit"
          id={editMatch.params.id}
          onHide={() => history.push("/ticket_escalation_policy/read-all-ticket-escalation-policy")}
          dataForRead={false}
        />
      )}

      {/* READ */}
      {readMatch && (
        <TicketEscalationPolicyEditDialog
          show={true}
          status="read"
          id={readMatch.params.id}
          onHide={() => history.push("/ticket_escalation_policy/read-all-ticket-escalation-policy")}
          dataForRead={true}
        />
      )}

      {/* DELETE */}
      {deleteMatch && isAccessForDelete && (
        <TicketEscalationPolicyDeleteDialog
          show={true}
          id={deleteMatch.params.id}
          status={deleteMatch.params.status}
          onHide={() => history.push("/ticket_escalation_policy/read-all-ticket-escalation-policy")}
        />
      )}

      {/* MAIN LIST */}
      <TicketEscalationPolicyCard />

      <ToastContainer position="top-right" autoClose={5000} />
    </TicketEscalationPolicyUIProvider>
  );
}