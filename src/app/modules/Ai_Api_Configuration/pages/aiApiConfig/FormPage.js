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
      history.push("/ai_api_configuration/read-all-ai-api-configuration/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/ai_api_configuration/read-all-ai-api-configuration/${id}/edit`);
    },
    openDeleteFormDialog: (id) => {
      history.push(`/ai_api_configuration/read-all-ai-api-configuration/${id}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/ai_api_configuration/read-all-ai-api-configuration/${id}/read`);
    },
    openVerifiedFormDialog: (id) => {
      history.push(`/ai_api_configuration/read-all-ai-api-configuration/${id}/verify`);
    },
  };
  
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/ai_api_configuration/read-all-ai-api-configuration/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/ai_api_configuration/read-all-ai-api-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/ai_api_configuration/read-all-ai-api-configuration/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/ai_api_configuration/read-all-ai-api-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/ai_api_configuration/read-all-ai-api-configuration/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/ai_api_configuration/read-all-ai-api-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/ai_api_configuration/read-all-ai-api-configuration/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/ai_api_configuration/read-all-ai-api-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/ai_api_configuration/read-all-ai-api-configuration/:id/verify">
        {({ history, match }) => (
          <FormVerifyDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/ai_api_configuration/read-all-ai-api-configuration");
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
