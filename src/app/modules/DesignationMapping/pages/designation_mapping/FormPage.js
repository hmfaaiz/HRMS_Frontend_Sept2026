import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/designation_mapping/read-all-designation-mapping/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/designation_mapping/read-all-designation-mapping/${id}/edit`);
    },
    openDeleteFormDialog: (id) => {
      history.push(`/designation_mapping/read-all-designation-mapping/${id}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/designation_mapping/read-all-designation-mapping/${id}/read`);
    },
  };
  
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/designation_mapping/read-all-designation-mapping/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            isNew={true}
            onHide={() => {
              history.push("/designation_mapping/read-all-designation-mapping");
            }}
          />
        )}
      </Route>
      <Route path="/designation_mapping/read-all-designation-mapping/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/designation_mapping/read-all-designation-mapping");
            }}
          />
        )}
      </Route>
      <Route path="/designation_mapping/read-all-designation-mapping/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/designation_mapping/read-all-designation-mapping");
            }}
          />
        )}
      </Route>
      <Route path="/designation_mapping/read-all-designation-mapping/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/designation_mapping/read-all-designation-mapping");
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
