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
      history.push("/exit_type_exit_reason/read-all-exit-type-exit-reason/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/exit_type_exit_reason/read-all-exit-type-exit-reason/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/exit_type_exit_reason/read-all-exit-type-exit-reason/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/exit_type_exit_reason/read-all-exit-type-exit-reason/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/exit_type_exit_reason/read-all-exit-type-exit-reason/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/exit_type_exit_reason/read-all-exit-type-exit-reason/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/exit_type_exit_reason/read-all-exit-type-exit-reason");
            }}
          />
        )}
      </Route>
      <Route path="/exit_type_exit_reason/read-all-exit-type-exit-reason/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/exit_type_exit_reason/read-all-exit-type-exit-reason");
            }}
          />
        )}
      </Route>
      <Route path="/exit_type_exit_reason/read-all-exit-type-exit-reason/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push("/exit_type_exit_reason/read-all-exit-type-exit-reason");
            }}
          />
        )}
      </Route>
      <Route path="/exit_type_exit_reason/read-all-exit-type-exit-reason/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/exit_type_exit_reason/read-all-exit-type-exit-reason");
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
