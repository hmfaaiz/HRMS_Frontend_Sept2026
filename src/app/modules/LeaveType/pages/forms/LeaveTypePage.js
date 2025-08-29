import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function LeaveTypePage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/leave_type/read-all-leave-type/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/leave_type/read-all-leave-type/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/leave_type/read-all-leave-type/${id}/${status}/delete`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/leave_type/read-all-leave-type/${id}/read`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/leave_type/read-all-leave-type/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/leave_type/read-all-leave-type");
            }}
          />
        )}
      </Route>
      <Route path="/leave_type/read-all-leave-type/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/leave_type/read-all-leave-type");
            }}
          />
        )}
      </Route>
      <Route path="/leave_type/read-all-leave-type/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/leave_type/read-all-leave-type");
            }}
          />
        )}
      </Route>
      <Route path="/leave_type/read-all-leave-type/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/leave_type/read-all-leave-type");
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
