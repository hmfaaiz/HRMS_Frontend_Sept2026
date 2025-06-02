import React from "react";
import { ToastContainer } from "react-toastify";
import { FormUIProvider } from "./FormUIContext";

import { Route } from "react-router-dom";
import FormCard from "./form_card/FormCard";
import { FormEditDialog } from "./form_edit_dialog/FormEditDialog";
export function InterviewSchedulePage({ history }) {
  const formEvents = {
    newInterview: () => {
      history.push("/interview_schedule/read-interview-schedule/new");
    },
    editInterview: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/edit`);
    },
    viewInterview: (Id) => {
      history.push(`/interview_schedule/read-interview-schedule/${Id}/view`);
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
      <Route exact path="/interview_schedule/read-interview-schedule/:Id/edit">
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
      <Route exact path="/interview_schedule/read-interview-schedule/:Id/view">
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
