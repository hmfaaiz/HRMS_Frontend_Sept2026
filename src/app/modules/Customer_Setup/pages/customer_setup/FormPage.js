import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CustomerUIProvider } from "./FormUIContext";
import { CustomerEditDialog } from "./form-edit-dialog/FormEditDialog";
import { CustomerCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import { CustomerDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const CustomerUIEvents = {
    newCustomerButtonClick: () => {
      dispatch(fetchAllCountry());
      history.push("/customer_setup/read-all-customer-setup/new");
    },
    openEditCustomerDialog: (id) => {
      dispatch(fetchAllCountry());
      history.push(`/customer_setup/read-all-customer-setup/${id}/edit`);
    },
    openReadCustomerDialog: (id) => {
      history.push(`/customer_setup/read-all-customer-setup/${id}/read`);
    },
    openDeleteCustomerDialog: (id) => {
      history.push(`/customer_setup/read-all-customer-setup/${id}/delete`);
    },
  };

  return (
    <CustomerUIProvider CustomerUIEvents={CustomerUIEvents}>
      {/* New Customer */}
      <Route exact path="/customer_setup/read-all-customer-setup/new">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            onHide={() =>
              history.push("/customer_setup/read-all-customer-setup")
            }
          />
        )}
      </Route>

      {/* Edit Customer */}
      <Route path="/customer_setup/read-all-customer-setup/:id/edit">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/customer_setup/read-all-customer-setup")
            }
          />
        )}
      </Route>

      {/* Read/View Customer */}
      <Route path="/customer_setup/read-all-customer-setup/:id/read">
        {({ history, match }) => (
          <CustomerEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() =>
              history.push("/customer_setup/read-all-customer-setup")
            }
          />
        )}
      </Route>

      {/* Delete Customer */}
      <Route path="/customer_setup/read-all-customer-setup/:id/delete">
        {({ history, match }) => (
          <CustomerDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push("/customer_setup/read-all-customer-setup")
            }
          />
        )}
      </Route>

      {/* Customer List/Card */}
      <CustomerCard />

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
    </CustomerUIProvider>
  );
}
