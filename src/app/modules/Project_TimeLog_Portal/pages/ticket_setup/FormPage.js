import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    openDeleteDialog: (id) => {
      history.push(`/time_logging_portal/read-all-time-log/${id}/delete`);
    },
  };

  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      {/* Delete Ticket */}
      <Route path="/time_logging_portal/read-all-time-log/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push("/time_logging_portal/read-all-time-log")}
          />
        )}
      </Route>
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
    </FormUIProvider>
  );
}
