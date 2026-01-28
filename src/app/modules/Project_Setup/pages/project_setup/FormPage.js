import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    newButtonClick: () => {
      history.push("/project_setup/read-all-project-setup/new");
    },
    openEditDialog: (id) => {
      history.push(`/project_setup/read-all-project-setup/${id}/edit`);
    },
    openReadDialog: (id) => {
      history.push(`/project_setup/read-all-project-setup/${id}/read`);
    },
    openDeleteDialog: (id) => {
      history.push(`/project_setup/read-all-project-setup/${id}/delete`);
    },
  };

  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      {/* New Project */}
      <Route exact path="/project_setup/read-all-project-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => history.push("/project_setup/read-all-project-setup")}
          />
        )}
      </Route>

      {/* Edit Project */}
      <Route path="/project_setup/read-all-project-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push("/project_setup/read-all-project-setup")}
          />
        )}
      </Route>

      {/* Read/View Project */}
      <Route path="/project_setup/read-all-project-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => history.push("/project_setup/read-all-project-setup")}
          />
        )}
      </Route>

      {/* Delete Project */}
      <Route path="/project_setup/read-all-project-setup/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push("/project_setup/read-all-project-setup")}
          />
        )}
      </Route>

      {/* Project List/Card */}
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
