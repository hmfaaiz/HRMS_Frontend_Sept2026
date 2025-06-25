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
import { DashboardSummary } from "./dashboard-summary/dashboardSummary";



export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {

    // openReadFormDialog: (id, isUserRead) => {
    //   history.push(`/recruitment_dashboard/read-all-resume-search-engine/${id}/read`);
    // },

    openReadFormDialog: (jobId,id) => {
      history.push(`/recruitment_dashboard/read-all-recruitment-dashboard/${jobId}/${id}/read`);
    },
      openApplicantReadFormDialog: (id) => {
  window.open(`/applicant_profile/read-all-applicant-profile/${id}/read`, "_blank");
},


  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>


  
      <Route path="/recruitment_dashboard/read-all-recruitment-dashboard/:jobId/:id/read">
        {({ history, match }) => (
          <FormEditDialog
           id={match && match.params.id}
           jobId={match && match.params.jobId}

            show={match != null}
            dataForRead={true}
            onHide={() => {
              history.push("/recruitment_dashboard/read-all-recruitment-dashboard");
            }}
          />
        )}
      </Route>
  






      <FormFIlter />
      <DashboardSummary />
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
