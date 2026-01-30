import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TicketStatusUIProvider } from "./FormUIContext";
import { TicketStatusEditDialog } from "./form-edit-dialog/FormEditDialog";
import { TicketStatusCard } from "./form-card/FormCard";
import { TicketStatusDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function TicketStatusFormPage({ history }) {
  const dispatch = useDispatch();

  const TicketStatusUIEvents = {
    newTicketStatusButtonClick: () => {
      history.push("/ticket_status/read-all-ticket-status/new");
    },
    openEditTicketStatusDialog: (id) => {
      history.push(`/ticket_status/read-all-ticket-status/${id}/edit`);
    },
    openReadTicketStatusDialog: (id) => {
      history.push(`/ticket_status/read-all-ticket-status/${id}/read`);
    },
    openDeleteTicketStatusDialog: (id) => {
      history.push(`/ticket_status/read-all-ticket-status/${id}/delete`);
    },
  };

  return (
    <TicketStatusUIProvider TicketStatusUIEvents={TicketStatusUIEvents}>
      {/* New Ticket Status */}
      <Route exact path="/ticket_status/read-all-ticket-status/new">
        {({ history, match }) => (
          <TicketStatusEditDialog
            show={match != null}
            onHide={() =>
              history.push("/ticket_status/read-all-ticket-status")
            }
          />
        )}
      </Route>

      {/* Edit Ticket Status */}
      <Route path="/ticket_status/read-all-ticket-status/:id/edit">
        {({ history, match }) => (
          <TicketStatusEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/ticket_status/read-all-ticket-status")
            }
          />
        )}
      </Route>

      {/* Read/View Ticket Status */}
      <Route path="/ticket_status/read-all-ticket-status/:id/read">
        {({ history, match }) => (
          <TicketStatusEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() =>
              history.push("/ticket_status/read-all-ticket-status")
            }
          />
        )}
      </Route>

      {/* Delete Ticket Status */}
      <Route path="/ticket_status/read-all-ticket-status/:id/delete">
        {({ history, match }) => (
          <TicketStatusDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/ticket_status/read-all-ticket-status")
            }
          />
        )}
      </Route>

      {/* Ticket Status List/Card */}
      <TicketStatusCard />

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </TicketStatusUIProvider>
  );
}
