import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {} from "../../_redux/redux-Actions";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      dispatch(fetchAllCountry());

      history.push("/reimbursement_configuration/read-all-reimbursement-configuration/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchAllCountry());

      history.push(`/reimbursement_configuration/read-all-reimbursement-configuration/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/reimbursement_configuration/read-all-reimbursement-configuration/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/reimbursement_configuration/read-all-reimbursement-configuration/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      
      
      history.push(`/reimbursement_configuration/read-all-reimbursement-configuration/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/reimbursement_configuration/read-all-reimbursement-configuration/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/reimbursement_configuration/read-all-reimbursement-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/reimbursement_configuration/read-all-reimbursement-configuration/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/reimbursement_configuration/read-all-reimbursement-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/reimbursement_configuration/read-all-reimbursement-configuration/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/reimbursement_configuration/read-all-reimbursement-configuration");
            }}
          />
        )}
      </Route>
      <Route path="/reimbursement_configuration/read-all-reimbursement-configuration/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/reimbursement_configuration/read-all-reimbursement-configuration");
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
