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
import { Switch } from "react-router-dom";


export function FormPage({ history }) {

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/job_vacancy/read-all-job-vacancy/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/read`);
    },
    openPostingFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/posting`);
    },
    openHoldFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/hold`);
    },
    openCloseFormDialog: (id, status) => {
      history.push(`/job_vacancy/read-all-job-vacancy/${id}/${status}/close`);
    },
  };
  return (


    // <FormUIProvider FormUIEvents={FormUIEvents}>
    //   <Route exact path="/job_vacancy/read-all-job-vacancy/new">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/edit">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/read">
    //     {({ history, match }) => (
    //       <FormEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         dataForRead={true}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/delete">
    //     {({ history, match }) => (
    //       <FormDeleteDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //       />
    //     )}
    //   </Route>

    //   {/* dynamic rendering */}

    //   {/* posting */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/posting">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Post Record"
    //         message="Are you sure you want to post this record?"
    //         confirmButtonText="Post Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="postJobVacancy"
    //       />
    //     )}
    //   </Route>

    //   {/* hold */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/hold">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Hold Record"
    //         message="Are you sure you want to hold this record?"
    //         confirmButtonText="Hold Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="holdJobVacancy"
    //       />
    //     )}
    //   </Route>


    //   {/* close */}
    //   <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/close">
    //     {({ history, match }) => (
    //       <FormDynamicDialogModal
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         title="Close Record"
    //         message="Are you sure you want to close this record?"
    //         confirmButtonText="Close Record"
    //         onHide={() => {
    //           history.push("/job_vacancy/read-all-job-vacancy");
    //         }}
    //         actionName="closeJobVacancy"
    //       />
    //     )}
    //   </Route>

    //   <FormFIlter />
    //   <FormCard />

    //   <ToastContainer
    //     position="top-right"
    //     autoClose={5000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     closeOnClick
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //   />
    // </FormUIProvider>




    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormFIlter />
      <FormCard />

      <Switch>
        {/* NEW */}
        <Route exact path="/job_vacancy/read-all-job-vacancy/new">
          {({ history, match }) => (
            <FormEditDialog
              show={match != null}
              onHide={() =>
                history.push("/job_vacancy/read-all-job-vacancy")
              }
            />
          )}
        </Route>

        {/* EDIT */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/edit">
          {({ history, match }) => (
            <FormEditDialog
              show={match != null}
              id={match?.params?.id}
              onHide={() =>
                history.push("/job_vacancy/read-all-job-vacancy")
              }
            />
          )}
        </Route>

        {/* READ */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/read">
          {({ history, match }) => (
            <FormEditDialog
              show={match != null}
              id={match?.params?.id}
              dataForRead={true}
              onHide={() =>
                history.push("/job_vacancy/read-all-job-vacancy")
              }
            />
          )}
        </Route>

        {/* DELETE */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/delete">
          {({ history, match }) => (
            <FormDeleteDialog
              show={match != null}
              id={match?.params?.id}
              status={match?.params?.status}
              onHide={() =>
                history.push("/job_vacancy/read-all-job-vacancy")
              }
            />
          )}
        </Route>

        {/* DYNAMIC ACTIONS */}


          //   {/* dynamic rendering */}

        {/* posting */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/posting">
          {({ history, match }) => (
            <FormDynamicDialogModal
              show={match != null}
              id={match && match.params.id}
              status={match && match.params.status}
              title="Post Record"
              message="Are you sure you want to post this record?"
              confirmButtonText="Post Record"
              onHide={() => {
                history.push("/job_vacancy/read-all-job-vacancy");
              }}
              actionName="postJobVacancy"
            />
          )}
        </Route>

        {/* hold */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/hold">
          {({ history, match }) => (
            <FormDynamicDialogModal
              show={match != null}
              id={match && match.params.id}
              status={match && match.params.status}
              title="Hold Record"
              message="Are you sure you want to hold this record?"
              confirmButtonText="Hold Record"
              onHide={() => {
                history.push("/job_vacancy/read-all-job-vacancy");
              }}
              actionName="holdJobVacancy"
            />
          )}
        </Route>


        {/* close */}
        <Route path="/job_vacancy/read-all-job-vacancy/:id/:status/close">
          {({ history, match }) => (
            <FormDynamicDialogModal
              show={match != null}
              id={match && match.params.id}
              status={match && match.params.status}
              title="Close Record"
              message="Are you sure you want to close this record?"
              confirmButtonText="Close Record"
              onHide={() => {
                history.push("/job_vacancy/read-all-job-vacancy");
              }}
              actionName="closeJobVacancy"
            />
          )}
        </Route>

      </Switch>

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
