import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function ArrearPolicyPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/arrear_policy/read-all-arrear-policy/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/arrear_policy/read-all-arrear-policy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/arrear_policy/read-all-arrear-policy/${id}/${status}/delete`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/arrear_policy/read-all-arrear-policy/${id}/read`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/arrear_policy/read-all-arrear-policy/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/arrear_policy/read-all-arrear-policy");
            }}
          />
        )}
      </Route>
      <Route path="/arrear_policy/read-all-arrear-policy/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/arrear_policy/read-all-arrear-policy");
            }}
          />
        )}
      </Route>
      <Route path="/arrear_policy/read-all-arrear-policy/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/arrear_policy/read-all-arrear-policy");
            }}
          />
        )}
      </Route>
      <Route path="/arrear_policy/read-all-arrear-policy/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/arrear_policy/read-all-arrear-policy");
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
