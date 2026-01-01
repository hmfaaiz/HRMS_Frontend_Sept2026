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

console.log("FormPage111111")
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/facilitator_ticket_creation/read-all-facilitator-ticket-creation/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/facilitator_ticket_creation/read-all-facilitator-ticket-creation/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/facilitator_ticket_creation/read-all-facilitator-ticket-creation/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/facilitator_ticket_creation/read-all-facilitator-ticket-creation/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/facilitator_ticket_creation/read-all-facilitator-ticket-creation/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>


        
            <Route path="/facilitator_ticket_creation/read-all-facilitator-ticket-creation/:id/:status/delete">
              {({ history, match }) => (
                <FormDeleteDialog
                  show={match != null}
                  id={match && match.params.id}
                  status={match && match.params.status}
                  onHide={() => {
                    history.push("/facilitator_ticket_creation/read-all-facilitator-ticket-creation");
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
