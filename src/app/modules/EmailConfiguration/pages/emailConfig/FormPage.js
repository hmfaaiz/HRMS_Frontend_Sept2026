import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";
import { FormVerifyDialog } from "./form-verify-dialog/FormVerifyDialog";

export function FormPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/email_configuration/read-all-email-config/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/email_configuration/read-all-email-config/${id}/edit`);
    },
    openDeleteFormDialog: (id) => {
      history.push(`/email_configuration/read-all-email-config/${id}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/email_configuration/read-all-email-config/${id}/read`);
    },
    openVerifiedFormDialog: (id) => {
      history.push(`/email_configuration/read-all-email-config/${id}/verify`);
    },
  };
  
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/email_configuration/read-all-email-config/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/email_configuration/read-all-email-config");
            }}
          />
        )}
      </Route>
      <Route path="/email_configuration/read-all-email-config/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/email_configuration/read-all-email-config");
            }}
          />
        )}
      </Route>
      <Route path="/email_configuration/read-all-email-config/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/email_configuration/read-all-email-config");
            }}
          />
        )}
      </Route>
      <Route path="/email_configuration/read-all-email-config/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/email_configuration/read-all-email-config");
            }}
          />
        )}
      </Route>
      <Route path="/email_configuration/read-all-email-config/:id/verify">
        {({ history, match }) => (
          <FormVerifyDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/email_configuration/read-all-email-config");
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
