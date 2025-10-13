import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/designation_wise_goal_setup/read-all-designation-wise-goal-setup/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/designation_wise_goal_setup/read-all-designation-wise-goal-setup/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/designation_wise_goal_setup/read-all-designation-wise-goal-setup/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/designation_wise_goal_setup/read-all-designation-wise-goal-setup/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/designation_wise_goal_setup/read-all-designation-wise-goal-setup/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/designation_wise_goal_setup/read-all-designation-wise-goal-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/designation_wise_goal_setup/read-all-designation-wise-goal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/designation_wise_goal_setup/read-all-designation-wise-goal-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/designation_wise_goal_setup/read-all-designation-wise-goal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/designation_wise_goal_setup/read-all-designation-wise-goal-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            dataForRead={true}
            onHide={() => {
              history.push("/designation_wise_goal_setup/read-all-designation-wise-goal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/designation_wise_goal_setup/read-all-designation-wise-goal-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/designation_wise_goal_setup/read-all-designation-wise-goal-setup");
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
