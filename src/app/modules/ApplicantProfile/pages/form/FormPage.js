import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";
import { FormFIlter } from "./form-filter/FormFIlter";



export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/applicant_profile/read-all-applicant-profile/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/read`);
    },
    openPostingFormDialog: (id, status) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/${status}/posting`);
    },
    openHoldFormDialog: (id, status) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/${status}/hold`);
    },
    openCloseFormDialog: (id, status) => {
      history.push(`/applicant_profile/read-all-applicant-profile/${id}/${status}/close`);
    },
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/applicant_profile/read-all-applicant-profile/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/applicant_profile/read-all-applicant-profile");
            }}
          />
        )}
      </Route>
      <Route path="/applicant_profile/read-all-applicant-profile/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/applicant_profile/read-all-applicant-profile");
            }}
          />
        )}
      </Route>
      <Route path="/applicant_profile/read-all-applicant-profile/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push("/applicant_profile/read-all-applicant-profile");
            }}
          />
        )}
      </Route>
      {/* <Route path="/applicant_profile/read-all-applicant-profile/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/applicant_profile/read-all-applicant-profile");
            }}
             actionName="deleteApplicantProfile"
          />
        )}
      </Route> */}

      {/* dynamic rendering */}



      {/* close */}
      <Route path="/applicant_profile/read-all-applicant-profile/:id/:status/delete">
        {({ history, match }) => (
          <FormDynamicDialogModal
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            title="Delete Record"
            message="Are you sure you want to delete this record?"
            confirmButtonText="Delete Record"
            onHide={() => {
              history.push("/applicant_profile/read-all-applicant-profile");
            }}
            actionName="deleteApplicantProfile"
          />
        )}
      </Route>

      <FormFIlter />
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
