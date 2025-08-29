import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function RoundingPolicyPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/salary_rounding_policy/read-all-rounding-policy/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/salary_rounding_policy/read-all-rounding-policy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/salary_rounding_policy/read-all-rounding-policy/${id}/${status}/delete`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/salary_rounding_policy/read-all-rounding-policy/${id}/read`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/salary_rounding_policy/read-all-rounding-policy/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/salary_rounding_policy/read-all-rounding-policy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_rounding_policy/read-all-rounding-policy/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/salary_rounding_policy/read-all-rounding-policy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_rounding_policy/read-all-rounding-policy/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/salary_rounding_policy/read-all-rounding-policy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_rounding_policy/read-all-rounding-policy/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/salary_rounding_policy/read-all-rounding-policy");
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
