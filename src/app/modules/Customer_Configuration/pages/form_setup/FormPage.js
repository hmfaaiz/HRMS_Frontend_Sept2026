import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const formUIEvents = {
    newButtonClick: () => {
      history.push(`/customer_config/read-all-customer-config/new`);
    },
    openEditDialog: (id) => {
      history.push(`/customer_config/read-all-customer-config/${id}/edit`);
    },
    openReadDialog: (id) => {
      history.push(`/customer_config/read-all-customer-config/${id}/read`);
    },
    openDeleteDialog: (id) => {
      history.push(`/customer_config/read-all-customer-config/${id}/delete`);
    },
  };

  return (
    <FormUIProvider formUIEvents={formUIEvents}>
      <Route exact path="/customer_config/read-all-customer-config/new">
        {({ history, match }) => {
          return (
            <FormEditDialog
              show={match != null}
              onHide={() =>
                history.push("/customer_config/read-all-customer-config")
              }
            />
          );
        }}
      </Route>

      <Route path="/customer_config/read-all-customer-config/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push("/customer_config/read-all-customer-config")}
          />
        )}
      </Route>

      <Route path="/customer_config/read-all-customer-config/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => history.push("/customer_config/read-all-customer-config")}
          />
        )}
      </Route>

      <Route path="/customer_config/read-all-customer-config/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => history.push("/customer_config/read-all-customer-config")}
          />
        )}
      </Route>

      <FormCard />

      {/* Toast notifications */}
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
