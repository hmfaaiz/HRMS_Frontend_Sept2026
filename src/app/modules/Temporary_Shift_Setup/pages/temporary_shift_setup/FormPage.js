import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function EmployeeTemporaryShiftPage({ history }) {

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/temporary_shift_setup/read-all-temporary-shift-setup/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/temporary_shift_setup/read-all-temporary-shift-setup/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/temporary_shift_setup/read-all-temporary-shift-setup/${id}/${status}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/temporary_shift_setup/read-all-temporary-shift-setup/${id}/read`);
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* Create */}
      <Route exact path="/temporary_shift_setup/read-all-temporary-shift-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/temporary_shift_setup/read-all-temporary-shift-setup");
            }}
          />
        )}
      </Route>

      {/* Edit */}
      <Route path="/temporary_shift_setup/read-all-temporary-shift-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push("/temporary_shift_setup/read-all-temporary-shift-setup");
            }}
          />
        )}
      </Route>

      {/* Read */}
      <Route path="/temporary_shift_setup/read-all-temporary-shift-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match?.params?.id}
            userForRead={true}
            onHide={() => {
              history.push("/temporary_shift_setup/read-all-temporary-shift-setup");
            }}
          />
        )}
      </Route>

      {/* Delete */}
      <Route path="/temporary_shift_setup/read-all-temporary-shift-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match?.params?.id}
            onHide={() => {
              history.push("/temporary_shift_setup/read-all-temporary-shift-setup");
            }}
          />
        )}
      </Route>

      <FormCard />

      <ToastContainer />
    </FormUIProvider>
  );
}