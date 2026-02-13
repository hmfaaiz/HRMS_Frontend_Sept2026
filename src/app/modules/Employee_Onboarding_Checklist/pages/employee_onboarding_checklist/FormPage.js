import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { EmployeeOnboardingUIProvider, useEmployeeOnboardingUIContext } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  // UI Events
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_onboarding_checklist/read-all-employee-onboarding-checklist/new");
    },
    openReadFormDialog: (Id) => {
      history.push({
        pathname: `/employee_onboarding_checklist/read-all-employee-onboarding-checklist/read`,
        state: { Id },
      });
    },
    openEditFormDialog: (Id) => {
      history.push({
        pathname: `/employee_onboarding_checklist/read-all-employee-onboarding-checklist/edit`,
        state: { Id },
      });
    },
    openDeleteFormDialog: (Id) => {
      // Will be handled in context state
    },
  };

  return (
    <EmployeeOnboardingUIProvider UIEvents={FormUIEvents}>
      <FormRoutes history={history} />
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
    </EmployeeOnboardingUIProvider>
  );
}

function FormRoutes({ history }) {
  const { idToDelete, closeDeleteDialog } = useEmployeeOnboardingUIContext();

  return (
    <>
      {/* NEW FORM */}
      <Route exact path="/employee_onboarding_checklist/read-all-employee-onboarding-checklist/new">
        {({ match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/employee_onboarding_checklist/read-all-employee-onboarding-checklist");
            }}
          />
        )}
      </Route>

      {/* EDIT FORM */}
      <Route path="/employee_onboarding_checklist/read-all-employee-onboarding-checklist/edit">
        {({ match, location }) => (
          <FormEditDialog
            show={match != null}
            Id={location.state?.Id || null}
            onHide={() => {
              history.push("/employee_onboarding_checklist/read-all-employee-onboarding-checklist");
            }}
          />
        )}
      </Route>

      {/* READ FORM */}
      <Route path="/employee_onboarding_checklist/read-all-employee-onboarding-checklist/read">
        {({ match, location }) => (
          <FormEditDialog
            show={match != null}
            dataForRead={true}
            Id={location.state?.Id || null}
            onHide={() => {
              history.push("/employee_onboarding_checklist/read-all-employee-onboarding-checklist");
            }}
          />
        )}
      </Route>

      {/* DELETE FORM (from context) */}
      {idToDelete && (
        <FormDeleteDialog
          show={true}
          Id={idToDelete}
          onHide={closeDeleteDialog}
        />
      )}
    </>
  );
}
