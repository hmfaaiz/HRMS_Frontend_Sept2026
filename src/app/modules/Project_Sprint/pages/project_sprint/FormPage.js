import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormExcuteDialog } from "./form-excute-dialog/FormExcuteDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    newButtonClick: () => {
      history.push("/project_sprint/read-all-project-sprint/new");
    },
    openEditDialog: (id) => {
      history.push(`/project_sprint/read-all-project-sprint/${id}/edit`);
    },
    openReadDialog: (id) => {
      history.push(`/project_sprint/read-all-project-sprint/${id}/read`);
    },
    openDeleteDialog: (id) => {
      history.push(`/project_sprint/read-all-project-sprint/${id}/delete`);
    },
    openExcuteDialog: (id, type) => {
      history.push(
        `/project_sprint/read-all-project-sprint/${id}/status/${type}`,
      );
    },
  };

  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      {/* New Project */}
      <Route exact path="/project_sprint/read-all-project-sprint/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() =>
              history.push("/project_sprint/read-all-project-sprint")
            }
          />
        )}
      </Route>

      {/* Edit Project */}
      <Route path="/project_sprint/read-all-project-sprint/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/project_sprint/read-all-project-sprint")
            }
          />
        )}
      </Route>

      {/* Read/View Project */}
      <Route path="/project_sprint/read-all-project-sprint/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() =>
              history.push("/project_sprint/read-all-project-sprint")
            }
          />
        )}
      </Route>

      {/* Delete Project */}
      <Route path="/project_sprint/read-all-project-sprint/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/project_sprint/read-all-project-sprint")
            }
          />
        )}
      </Route>

      {/* Delete Project */}
      <Route path="/project_sprint/read-all-project-sprint/:id/status/:type">
        {({ history, match }) => (
          <FormExcuteDialog
            show={match != null}
            id={match && match.params.id}
            type={match && match.params.type}
            onHide={() =>
              history.push("/project_sprint/read-all-project-sprint")
            }
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
