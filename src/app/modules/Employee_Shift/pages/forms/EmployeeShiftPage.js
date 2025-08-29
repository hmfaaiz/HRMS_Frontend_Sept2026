import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function EmployeeShiftPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_shift/read-all-employee-shift/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/employee_shift/read-all-employee-shift/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/employee_shift/read-all-employee-shift/${id}/${status}/delete`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/employee_shift/read-all-employee-shift/${id}/read`);
    },
  };
  return (

    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/employee_shift/read-all-employee-shift/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/employee_shift/read-all-employee-shift");
            }}
          />
        )}
      </Route>
      <Route path="/employee_shift/read-all-employee-shift/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_shift/read-all-employee-shift");
            }}
          />
        )}
      </Route>
      <Route path="/employee_shift/read-all-employee-shift/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/employee_shift/read-all-employee-shift");
            }}
          />
        )}
      </Route>
      <Route path="/employee_shift/read-all-employee-shift/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_shift/read-all-employee-shift");
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
