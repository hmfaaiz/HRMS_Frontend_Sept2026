import React from "react";
import { ToastContainer } from "react-toastify";
import { FormUIProvider } from "./FormUIContext";

import { Route } from "react-router-dom";
import FormCard from "./form_card/FormCard";
import { FormEditDialog } from "./form_edit_dialog/FormEditDialog";
import { FormDeleteDialog } from "./form_delete_dialog/FormDeleteDialog";
import { FormEmailDialog } from "./form_email_dialog/FormEmailDialog";
export function InterviewSchedulePage({ history }) {
  const formEvents = {
    newButtonClick: () => {
      history.push("/interview_schedule/read-interview-schedule/new");
    },
    openEditFormDialog: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/edit`);
    },
    openReadFormDialog: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/view`);
    },
    openDeleteFormDialog: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/delete`);
    },
    openEmailFormDialog: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/email`);
    },
  };

  return (
    <FormUIProvider FormUIEvents={formEvents}>
      <Route exact path="/interview_schedule/read-interview-schedule/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/interview_schedule/read-interview-schedule");
            }}
          />
        )}
      </Route>
      <Route exact path="/interview_schedule/read-interview-schedule/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/interview_schedule/read-interview-schedule");
            }}
          />
        )}
      </Route>
      <Route exact path="/interview_schedule/read-interview-schedule/:id/view">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            isUserForRead={true}
            id={match && match.params.id}
            onHide={() => {
              history.push("/interview_schedule/read-interview-schedule");
            }}
          />
        )}
      </Route>
      <Route
        exact
        path="/interview_schedule/read-interview-schedule/:id/delete"
      >
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/interview_schedule/read-interview-schedule");
            }}
          />
        )}
      </Route>
      <Route exact path="/interview_schedule/read-interview-schedule/:id/email">
        {({ history, match }) => (
          <FormEmailDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/interview_schedule/read-interview-schedule");
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
