import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormSendEmailDialog } from "./form-send-email-dialog/FormSendEmailDialog";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";



export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/policy_for_new_year_budget/read-all-policy-for-new-year-budget/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/policy_for_new_year_budget/read-all-policy-for-new-year-budget/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/policy_for_new_year_budget/read-all-policy-for-new-year-budget/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/policy_for_new_year_budget/read-all-policy-for-new-year-budget/${id}/read`);
    },
    openSendEmailFormDialog: (id, isUserRead) => {
      history.push(`/policy_for_new_year_budget/read-all-policy-for-new-year-budget/${id}/send-email`);
    },
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget");
            }}
          />
        )}
      </Route>
      <Route path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget");
            }}
          />
        )}
      </Route>
      <Route path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget");
            }}
          />
        )}
      </Route>
      <Route path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget");
            }}
          />
        )}
      </Route>
      <Route path="/policy_for_new_year_budget/read-all-policy-for-new-year-budget/:id/send-email">
        {({ history, match }) => (
          <FormSendEmailDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/policy_for_new_year_budget/read-all-policy-for-new-year-budget");
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
