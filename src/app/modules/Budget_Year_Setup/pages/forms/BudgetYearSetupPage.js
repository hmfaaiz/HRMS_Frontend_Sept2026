import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function BudgetYearSetupPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/budget_setup_year/read-all-budget-setup/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/budget_setup_year/read-all-budget-setup/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/budget_setup_year/read-all-budget-setup/${id}/${status}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/budget_setup_year/read-all-budget-setup/${id}/read`);
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/budget_setup_year/read-all-budget-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/budget_setup_year/read-all-budget-setup");
            }}
          />
        )}
      </Route>
      <Route path="/budget_setup_year/read-all-budget-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/budget_setup_year/read-all-budget-setup");
            }}
          />
        )}
      </Route>
      <Route path="/budget_setup_year/read-all-budget-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/budget_setup_year/read-all-budget-setup");
            }}
          />
        )}
      </Route>
      <Route path="/budget_setup_year/read-all-budget-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/budget_setup_year/read-all-budget-setup");
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
