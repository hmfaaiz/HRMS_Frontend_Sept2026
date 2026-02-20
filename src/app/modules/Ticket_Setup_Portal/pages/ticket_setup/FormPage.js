import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormTimeLogDialog } from "./form-time-log-dialog/FormTimeLogDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    newButtonClick: (query = null) => {
      history.push(
        `/ticket_setup_portal/read-all-ticket-setup/new${query ? query : ""}`,
      );
    },
    openEditDialog: (id) => {
      history.push(`/ticket_setup_portal/read-all-ticket-setup/${id}/edit`);
    },
    openReadDialog: (id) => {
      history.push(`/ticket_setup_portal/read-all-ticket-setup/${id}/read`);
    },
    openDeleteDialog: (id) => {
      history.push(`/ticket_setup_portal/read-all-ticket-setup/${id}/delete`);
    },
    openDetailTimeLog: (id) => {
      history.push(`/ticket_setup_portal/read-all-ticket-setup/${id}/time-log`);
    },
    openTicketActivity: (query = null) => {
      window.open(
        `/ticket_activity_portal/read-ticket-activity${query ? query : ""}`,
        "_blank",
      );
    },
    openTicketTimeLogging: (query = null) => {
      window.open(
        `/time_logging_portal/read-all-time-log${query ? query : ""}`,
        "_blank",
      );
    },
  };

  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      <Switch>
        {/* New Ticket - MUST BE FIRST */}
        <Route exact path="/ticket_setup_portal/read-all-ticket-setup/new">
          {({ history, match, location }) => {
            const queryParams = Object.fromEntries(
              new URLSearchParams(location.search).entries(),
            );
            return (
              <>
                <FormCard />
                <FormEditDialog
                  show={match != null}
                  query={queryParams}
                  onHide={() =>
                    history.push("/ticket_setup_portal/read-all-ticket-setup")
                  }
                />
              </>
            );
          }}
        </Route>

        {/* Edit Ticket */}
        <Route path="/ticket_setup_portal/read-all-ticket-setup/:id/edit">
          {({ history, match }) => (
            <>
              <FormCard />
              <FormEditDialog
                show={match != null}
                id={match && match.params.id}
                onHide={() =>
                  history.push("/ticket_setup_portal/read-all-ticket-setup")
                }
              />
            </>
          )}
        </Route>

        {/* Read/View Ticket */}
        <Route path="/ticket_setup_portal/read-all-ticket-setup/:id/read">
          {({ history, match }) => (
            <>
              <FormCard />
              <FormEditDialog
                show={match != null}
                id={match && match.params.id}
                userForRead={true}
                onHide={() =>
                  history.push("/ticket_setup_portal/read-all-ticket-setup")
                }
              />
            </>
          )}
        </Route>

        {/* Delete Ticket */}
        <Route path="/ticket_setup_portal/read-all-ticket-setup/:id/delete">
          {({ history, match }) => (
            <>
              <FormCard />
              <FormDeleteDialog
                show={match != null}
                id={match && match.params.id}
                onHide={() =>
                  history.push("/ticket_setup_portal/read-all-ticket-setup")
                }
              />
            </>
          )}
        </Route>

        {/* Time Log Detail */}
        <Route path="/ticket_setup_portal/read-all-ticket-setup/:id/time-log">
          {({ history, match }) => (
            <>
              <FormCard />
              <FormTimeLogDialog
                show={match != null}
                id={match && match.params.id}
                onHide={() =>
                  history.push("/ticket_setup_portal/read-all-ticket-setup")
                }
              />
            </>
          )}
        </Route>

        {/* Default: Ticket List */}
        <Route path="/ticket_setup_portal/read-all-ticket-setup">
          <FormCard />
        </Route>
      </Switch>

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
    </FormUIProvider>
  );
}
