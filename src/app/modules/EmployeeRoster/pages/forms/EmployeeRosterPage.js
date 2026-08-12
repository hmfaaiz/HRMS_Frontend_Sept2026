import React from "react";
import { Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function EmployeeRosterPage({ history }) {
  const location = useLocation();

  const FormUIEvents = {
    openDeleteFormDialog: (id, status) => {

      // OLD URL
      // history.push(`/employee_roster/read-all-employee-roster/${id}/${status}/delete`);

      // NEW URL - ID and status hidden from URL
      history.push({
        pathname: "/employee_roster/read-all-employee-roster/delete",
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
      <Route path="/employee_roster/read-all-employee-roster/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_roster/read-all-employee-roster");
            }}
          />
        )}
      </Route>
      */}

      {/* NEW URL - ID and status are passed through location.state */}
      <Route path="/employee_roster/read-all-employee-roster/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/employee_roster/read-all-employee-roster");
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