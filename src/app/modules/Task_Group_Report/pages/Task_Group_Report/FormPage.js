import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskAssignmentTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { DetailData } from "./modal/DetailData";
import { DetailTimeLog } from "./modal/DetailTimeLog";

import { TimeLog } from "./modal/TimeLog";

export function FormPage({ history }) {
  const taskAssignmentTimelineUIEvents = {
    openDetailGridData: (masterId) => {
      history.push(
        `/task_assignment_timeline/read-all-task-assignment-timeline/${masterId}/detail`
      );
    },
    openDetailTimeLog: (detailId) => {
      history.push(
        `/task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/detailtimelog`
      );
    },
        openTicketTimeLog: (detailId, isUserRead) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/timelog`);
    },
    addNewTicket: () => {
      window.open(
        "/facilitator_ticket_creation/read-all-facilitator-ticket-creation",
        "_blank"
      );
    },
  };

  // Required by DetailTimeLog from facilitator ticket creation
  const facilitatorFormUIEvents = {
    openDetailGridData: () => {},
    openDetailTimeLog: () => {},
    openTicketTimeLog: () => {},
    newFormButtonClick: () => {},
    openEditFormDialog: () => {},
    openDeleteFormDialog: () => {},
    openActiveFormDialog: () => {},
    openReadFormDialog: () => {},
    openReceiveFormDialog: () => {},
  };

  return (
    <TaskAssignmentTimelineUIProvider
      taskAssignmentTimelineUIEvents={taskAssignmentTimelineUIEvents}
    >
      {/* Detail modal route */}
      <Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:masterId/detail">
        {({ history, match }) => (
          <DetailData
            show={match != null}
            detailId={match && match.params.masterId}
            onHide={() =>
              history.push("/task_assignment_timeline/read-all-task-assignment-timeline")
            }
          />
        )}
      </Route>

      {/* Detail Time Log modal route */}
      {/* <Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:detailId/detailtimelog">
        {({ history, match }) => (
          <FormUIProvider FormUIEvents={facilitatorFormUIEvents}>
            <DetailTimeLog
              show={match != null}
              detailId={match && match.params.detailId}
              onHide={() =>
                history.push("/task_assignment_timeline/read-all-task-assignment-timeline")
              }
            />
          </FormUIProvider>
        )}
      </Route> */}

          <Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:detailId/timelog">
        {({ history, match }) => (
          <TimeLog
            show={match != null}
            detailId={match && match.params.detailId}
            status={match && match.params.status}
            onHide={() => {
              history.push("/task_assignment_timeline/read-all-task-assignment-timeline");
            }}
          />
        )}
      </Route>


<Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:detailId/detailtimelog">
  {({ history, match }) => {
    const show = match != null;
    const detailId = match?.params.detailId;

    return (
      <DetailTimeLog
        show={show}
        detailId={detailId}
        onHide={() =>
          history.push("/task_assignment_timeline/read-all-task-assignment-timeline")
        }
      />
    );
  }}
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
    </TaskAssignmentTimelineUIProvider>
  );
}