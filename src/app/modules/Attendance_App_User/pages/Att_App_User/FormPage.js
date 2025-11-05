import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormStatusChangeDialog } from "./form-status-change-dialog/FormStatusChangeDialog";

export function FormPage({ history }) {
  const FormUIEvents = {
    openChangeStatusDialog: (id) => {
      history.push(`/app_user/read-all-app-user/${id}/status`);
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/app_user/read-all-app-user/:id/status">
        {({ history, match }) => (
          <FormStatusChangeDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/app_user/read-all-app-user");
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
