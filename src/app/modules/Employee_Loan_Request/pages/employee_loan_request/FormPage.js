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
import { InstallmentDetails } from "./form-delete-dialog/InstallmentDetails";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const FormUIEvents = {

    openDeleteFormDialog: (id, status) => {

      // OLD URL
      // history.push(`/employee_loan_request/read-all-employee-loan-request/${id}/${status}/delete`);

      // NEW URL - ID and status hidden from URL
      history.push({
        pathname: "/employee_loan_request/read-all-employee-loan-request/delete",
        state: {
          id,
          status,
        },
      });
    },

    openInstallmentDetails: (id, status) => {

      // OLD URL
      // history.push(`/employee_loan_request/read-all-employee-loan-request/${id}/detail`);

      // NEW URL - ID hidden from URL
      history.push({
        pathname: "/employee_loan_request/read-all-employee-loan-request/detail",
        state: {
          id,
          status,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* DELETE */}

      {/* OLD URL */}
      {/*
      <Route path="/employee_loan_request/read-all-employee-loan-request/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_loan_request/read-all-employee-loan-request");
            }}
          />
        )}
      </Route>
      */}

      {/* NEW URL - ID and status from location.state */}
      <Route path="/employee_loan_request/read-all-employee-loan-request/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/employee_loan_request/read-all-employee-loan-request");
            }}
          />
        )}
      </Route>

      {/* INSTALLMENT DETAILS */}

      {/* OLD URL */}
      {/*
      <Route path="/employee_loan_request/read-all-employee-loan-request/:id/detail">
        {({ history, match }) => (
          <InstallmentDetails
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_loan_request/read-all-employee-loan-request");
            }}
          />
        )}
      </Route>
      */}

      {/* NEW URL - ID and status from location.state */}
      <Route path="/employee_loan_request/read-all-employee-loan-request/detail">
        {({ history, match }) => (
          <InstallmentDetails
            show={match != null}
            id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/employee_loan_request/read-all-employee-loan-request");
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