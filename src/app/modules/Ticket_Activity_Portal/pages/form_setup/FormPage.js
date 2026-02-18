import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider, useFormUIContext } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { Route } from "react-router-dom";
import { FormEditDialog } from "../../../Ticket_Setup_Portal/pages/ticket_setup/form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    addTicketButtonClick: (query = null) => {
      history.push(
        `/ticket_activity_portal/read-ticket-activity/new${query ? query : ""}`,
      );
    },
    openTicketEditDialog: (id) => {
      history.push(`/ticket_activity_portal/read-ticket-activity/${id}/edit`);
    },
  };
  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      <FormPageRoutes />
    </FormUIProvider>
  );
}

function FormPageRoutes() {
  const { refreshSubTickets, deleteModal, setDeleteModal } = useFormUIContext();

  return (
    <>
      {/* New Ticket */}
      <Route exact path="/ticket_activity_portal/read-ticket-activity/new">
        {({ history, match, location }) => {
          const queryParams = Object?.fromEntries(
            new URLSearchParams(location?.search)?.entries(),
          );
          if (!queryParams)
            history.push("/ticket_activity_portal/read-ticket-activity");
          return (
            <FormEditDialog
              show={match != null}
              query={queryParams}
              onHide={() => {
                refreshSubTickets?.();
                history.push("/ticket_activity_portal/read-ticket-activity");
              }}
            />
          );
        }}
      </Route>

      {/* Edit Ticket */}
      <Route path="/ticket_activity_portal/read-ticket-activity/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/ticket_activity_portal/read-ticket-activity")
            }
          />
        )}
      </Route>
      {deleteModal ? (
        <FormDeleteDialog
          id={deleteModal}
          show={deleteModal}
          onHide={() => setDeleteModal(null)}
        />
      ) : null}
      {/* Ticket List/Card */}
      <FormCard />
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
    </>
  );
}
