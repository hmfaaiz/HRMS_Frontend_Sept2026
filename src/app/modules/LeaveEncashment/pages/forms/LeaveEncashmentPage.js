import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function LeaveEncashmentPage({ history }) {
  const FormUIEvents = {
    openDeleteFormDialog: (id) => {
      history.push(`/leave_encashment/read-all-leave-encashment/${id}/delete`);
    }
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/leave_encashment/read-all-leave-encashment/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/leave_encashment/read-all-leave-encashment");
            }}
          />
        )}
      </Route>
      <FormCard />
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
