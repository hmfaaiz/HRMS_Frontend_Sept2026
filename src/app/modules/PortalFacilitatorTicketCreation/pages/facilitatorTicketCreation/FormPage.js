import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";
import { DetailData } from "./modal/DetailData";
import { TimeLog } from "./modal/TimeLog";
import { DetailTimeLog } from "./modal/DetailTimeLog";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/portal_ticket_creation/read-all-facilitator-ticket-creation/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
  
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${id}/read`);
    },
    openReceiveFormDialog: (id, isUserRead) => {
      history.push(`/portal_ticket_creation/read-all-receive/${id}/receive`);
    },
    openDetailGridData: (detailId, isUserRead) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${detailId}/detail`);
    },
    openTicketTimeLog: (detailId, isUserRead) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${detailId}/timelog`);
    },
    openDetailTimeLog: (detailId, isUserRead) => {
      history.push(`/portal_ticket_creation/read-all-facilitator-ticket-creation/${detailId}/detailtimelog`);
    },
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>



      <Route path="/portal_ticket_creation/read-all-facilitator-ticket-creation/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/portal_ticket_creation/read-all-facilitator-ticket-creation");
            }}
          />
        )}
      </Route>


      <Route path="/portal_ticket_creation/read-all-facilitator-ticket-creation/:detailId/detail">
        {({ history, match }) => (
          <DetailData
            show={match != null}
            detailId={match && match.params.detailId}
            status={match && match.params.status}
            onHide={() => {
              history.push("/portal_ticket_creation/read-all-facilitator-ticket-creation");
            }}
          />
        )}
      </Route>

      <Route path="/portal_ticket_creation/read-all-facilitator-ticket-creation/:detailId/timelog">
        {({ history, match }) => (
          <TimeLog
            show={match != null}
            detailId={match && match.params.detailId}
            status={match && match.params.status}
            onHide={() => {
              history.push("/portal_ticket_creation/read-all-facilitator-ticket-creation");
            }}
          />
        )}
      </Route>


       <Route path="/portal_ticket_creation/read-all-facilitator-ticket-creation/:detailId/detailtimelog">
        {({ history, match }) => (
          <DetailTimeLog
            show={match != null}
            detailId={match && match.params.detailId}
            status={match && match.params.status}
            onHide={() => {
              history.push("/portal_ticket_creation/read-all-facilitator-ticket-creation");
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
