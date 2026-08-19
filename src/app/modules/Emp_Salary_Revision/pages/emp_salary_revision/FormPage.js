
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

      // history.push(`/emp_salary_revision/read-all-employee-salary-revision/${id}/${status}/delete`);
      history.push({
        pathname:
          "/emp_salary_revision/read-all-employee-salary-revision/delete",
        state: {
          id,
          status,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      <Route
        // path="/emp_salary_revision/read-all-employee-salary-revision/:id/:status/delete"
        path="/emp_salary_revision/read-all-employee-salary-revision/delete"
      >
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            // status={match && match.params.status}
            status={location.state?.status}
            onHide={() => {
              history.push(
                "/emp_salary_revision/read-all-employee-salary-revision"
              );
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

