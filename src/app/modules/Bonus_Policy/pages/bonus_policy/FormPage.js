// pages/Bonus_Policy/FormPage.jsx
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
      history.push("/bonus_policy/read-all-bonus-policy/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/bonus_policy/read-all-bonus-policy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/bonus_policy/read-all-bonus-policy/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/bonus_policy/read-all-bonus-policy/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/bonus_policy/read-all-bonus-policy/${id}/read`);
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/bonus_policy/read-all-bonus-policy/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/bonus_policy/read-all-bonus-policy");
            }}
          />
        )}
      </Route>
      <Route path="/bonus_policy/read-all-bonus-policy/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/bonus_policy/read-all-bonus-policy");
            }}
          />
        )}
      </Route>
      <Route path="/bonus_policy/read-all-bonus-policy/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/bonus_policy/read-all-bonus-policy");
            }}
          />
        )}
      </Route>
      <Route path="/bonus_policy/read-all-bonus-policy/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/bonus_policy/read-all-bonus-policy");
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