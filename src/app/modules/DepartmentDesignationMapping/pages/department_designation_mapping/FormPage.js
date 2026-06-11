import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/department_designation_map/read-all-department-designation-map/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/department_designation_map/read-all-department-designation-map/${id}/edit`);
    },
    openDeleteFormDialog: (id) => {
      history.push(`/department_designation_map/read-all-department-designation-map/${id}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/department_designation_map/read-all-department-designation-map/${id}/read`);
    },
  };
  
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/department_designation_map/read-all-department-designation-map/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            isNew={true}
            onHide={() => {
              history.push("/department_designation_map/read-all-department-designation-map");
            }}
          />
        )}
      </Route>
      <Route path="/department_designation_map/read-all-department-designation-map/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/department_designation_map/read-all-department-designation-map");
            }}
          />
        )}
      </Route>
      <Route path="/department_designation_map/read-all-department-designation-map/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/department_designation_map/read-all-department-designation-map");
            }}
          />
        )}
      </Route>
      <Route path="/department_designation_map/read-all-department-designation-map/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/department_designation_map/read-all-department-designation-map");
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
