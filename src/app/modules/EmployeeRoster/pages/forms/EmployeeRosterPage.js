import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function EmployeeRosterPage({ history }) {
  const FormUIEvents = {
    openDeleteFormDialog: (id, status) => {
      history.push(`/employee_roster/read-all-employee-roster/${id}/${status}/delete`);
    }
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
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
