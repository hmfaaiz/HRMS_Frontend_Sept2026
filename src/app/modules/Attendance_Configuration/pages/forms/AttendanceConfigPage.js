import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function AttendanceConfigPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/attendance_configuration/read-all-att-configuration/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/attendance_configuration/read-all-att-configuration/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/attendance_configuration/read-all-att-configuration/${id}/${status}/delete`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/attendance_configuration/read-all-att-configuration/${id}/read`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/attendance_configuration/read-all-att-configuration/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/attendance_configuration/read-all-att-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/attendance_configuration/read-all-att-configuration/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/attendance_configuration/read-all-att-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/attendance_configuration/read-all-att-configuration/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/attendance_configuration/read-all-att-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/attendance_configuration/read-all-att-configuration/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/attendance_configuration/read-all-att-configuration");
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
