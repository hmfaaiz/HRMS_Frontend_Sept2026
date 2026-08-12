import React from "react";
import { useDispatch } from "react-redux";
import { Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const FormUIEvents = {
    openDeleteFormDialog: (id, status) => {
      // history.push(`/reimbursement_claim/read-all-reimbursement-claim/${id}/${status}/delete`);

      history.push({
        pathname: "/reimbursement_claim/read-all-reimbursement-claim/delete",
        state: {
          id,
          status,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* Delete */}

      {/* OLD ROUTE */}
      {/* 
      <Route path="/reimbursement_claim/read-all-reimbursement-claim/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/reimbursement_claim/read-all-reimbursement-claim");
            }}
          />
        )}
      </Route>
      */}

      {/* UPDATED ROUTE */}
      <Route path="/reimbursement_claim/read-all-reimbursement-claim/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            // id={match && match.params.id}
            // status={match && match.params.status}
            id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/reimbursement_claim/read-all-reimbursement-claim");
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