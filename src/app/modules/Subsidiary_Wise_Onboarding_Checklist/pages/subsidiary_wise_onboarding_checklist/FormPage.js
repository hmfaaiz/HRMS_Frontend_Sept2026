import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SubsidiaryOnboardingUIProvider } from "./FormUIContext";
import { SubsidiaryOnboardingEditDialog } from "./form-edit-dialog/FormEditDialog";
import { SubsidiaryOnboardingDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { SubsidiaryOnboardingCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  console.log("page1111");
  const dispatch = useDispatch();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/onboarding_checklist/read-all-onboarding-checklist/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/onboarding_checklist/read-all-onboarding-checklist/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/onboarding_checklist/read-all-onboarding-checklist/${id}/${status}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/onboarding_checklist/read-all-onboarding-checklist/${id}/read`);
    },
     openReadFormDialog: (subsidiaryId) => {  // Changed from id to subsidiaryId
    history.push(`/onboarding_checklist/read-all-onboarding-checklist/${subsidiaryId}/read`);
  },
  };

  return (
    <SubsidiaryOnboardingUIProvider FormUIEvents={FormUIEvents}>
      {/* New Form */}
      <Route exact path="/onboarding_checklist/read-all-onboarding-checklist/new">
        {({ history, match }) => (
          <SubsidiaryOnboardingEditDialog
            show={match != null}
            onHide={() => history.push("/onboarding_checklist/read-all-onboarding-checklist")}
          />
        )}
      </Route>

      {/* Edit Form */}
      <Route path="/onboarding_checklist/read-all-onboarding-checklist/:id/edit">
        {({ history, match }) => (
          <SubsidiaryOnboardingEditDialog
            show={match != null}
            id={match?.params.id}
            onHide={() => history.push("/onboarding_checklist/read-all-onboarding-checklist")}
          />
        )}
      </Route>

      {/* Read Form */}
      <Route path="/onboarding_checklist/read-all-onboarding-checklist/:id/read">
        {({ history, match }) => (
          <SubsidiaryOnboardingEditDialog
            show={match != null}
            id={match?.params.id}
            dataForRead={true}
            onHide={() => history.push("/onboarding_checklist/read-all-onboarding-checklist")}
          />
        )}
      </Route>
      

      {/* Delete Form */}
      <Route path="/onboarding_checklist/read-all-onboarding-checklist/:id/:status/delete">
        {({ history, match }) => (
          <SubsidiaryOnboardingDeleteDialog
            show={match != null}
            id={match?.params.id}
            status={match?.params.status}
            onHide={() => history.push("/onboarding_checklist/read-all-onboarding-checklist")}
          />
        )}
      </Route>

      <SubsidiaryOnboardingCard />

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
    </SubsidiaryOnboardingUIProvider>
  );
}
