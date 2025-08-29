import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";



export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/gratuity_configuration/read-all-gratuity-configuration/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/gratuity_configuration/read-all-gratuity-configuration/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/gratuity_configuration/read-all-gratuity-configuration/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/gratuity_configuration/read-all-gratuity-configuration/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/gratuity_configuration/read-all-gratuity-configuration/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/gratuity_configuration/read-all-gratuity-configuration/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/gratuity_configuration/read-all-gratuity-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/gratuity_configuration/read-all-gratuity-configuration/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/gratuity_configuration/read-all-gratuity-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/gratuity_configuration/read-all-gratuity-configuration/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/gratuity_configuration/read-all-gratuity-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/gratuity_configuration/read-all-gratuity-configuration/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/gratuity_configuration/read-all-gratuity-configuration");
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
