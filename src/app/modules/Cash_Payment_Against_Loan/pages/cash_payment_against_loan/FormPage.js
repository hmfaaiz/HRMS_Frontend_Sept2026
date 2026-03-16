import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

const BASE_ROUTE =
  "/cash_payment_against_loan/read-all-cash-payment-against-loan";

export function FormPage({ history }) {
  const FormUIEvents = {
    openDeleteFormDialog: (id, status) => {
      history.push(`${BASE_ROUTE}/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id, status) => {
      history.push(`${BASE_ROUTE}/${id}/${status}/delete`);
    },
    // Edit and View are handled inline via context ids + isViewMode
    openEditFormDialog: () => {},
    openViewFormDialog: () => {},
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* ── Delete dialog route ── */}
      <Route path={`${BASE_ROUTE}/:id/:status/delete`}>
        {({ history: h, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push(BASE_ROUTE)}
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