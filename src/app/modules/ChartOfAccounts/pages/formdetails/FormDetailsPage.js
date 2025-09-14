import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormDetailsUIContext";
import { FormEditDialog } from "./formdetails-edit-dialog/FormDetailsEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { FormCard } from "./formdetails-card/FormDetailsCard";
import { FormActiveDialog } from "./formdetails-active-dialog/FormDetailsActiveDialog";


export function FormDetailsPage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {  
      history.push("/chart_account/read-all-chart-of-accounts/new");
    },
    openEditFormDialog: (id) => { 
      history.push(`/chart_account/read-all-chart-of-accounts/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/chart_account/read-all-chart-of-accounts/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/chart_account/read-all-chart-of-accounts/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/chart_account/read-all-chart-of-accounts/${id}/read`);
    },
  };
  return (
    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/chart_account/read-all-chart-of-accounts/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/chart_account/read-all-chart-of-accounts");
            }}
          />
        )}
      </Route>
      <Route path="/chart_account/read-all-chart-of-accounts/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/chart_account/read-all-chart-of-accounts");
            }}
          />
        )}
      </Route>
      <Route path="/chart_account/read-all-chart-of-accounts/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/chart_account/read-all-chart-of-accounts");
            }}
          />
        )}
      </Route>
      <Route path="/chart_account/read-all-chart-of-accounts/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/chart_account/read-all-chart-of-accounts");
            }}
          />
        )}
      </Route>
      <Route path="/chart_account/read-all-chart-of-accounts/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/chart_account/read-all-chart-of-accounts");
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
