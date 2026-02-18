// import React from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { TaskAssignmentTimelineUIProvider } from "./FormUIContext";
// import { FormCard } from "./form-card/FormCard";

// export function FormPage() {
//   return (
//     <TaskAssignmentTimelineUIProvider>
//       {/* Task Assignment Timeline List / Card */}
//       <FormCard />

//       {/* Optional Toast notifications */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </TaskAssignmentTimelineUIProvider>
//   );
// }


import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskAssignmentTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
// IMPORT: Add FormUIProvider and modals from facilitator ticket creation
import { FormUIProvider } from "../../../FacilitatorTicketCreation/pages/facilitatorTicketCreation/FormUIContext";
import { DetailData } from "../../../FacilitatorTicketCreation/pages/facilitatorTicketCreation/modal/DetailData";
import { DetailTimeLog } from "../../../FacilitatorTicketCreation/pages/facilitatorTicketCreation/modal/DetailTimeLog";

export function FormPage({ history }) {
  // Task Assignment Timeline navigation events
  const taskAssignmentTimelineUIEvents = {
    openDetailGridData: (masterId) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${masterId}/detail`);
    },
    openDetailTimeLog: (detailId) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/detailtimelog`);
    },
    // ADD: Navigate to ticket creation form in NEW TAB
    addNewTicket: () => {
      window.open("/facilitator_ticket_creation/read-all-facilitator-ticket-creation", "_blank");
    },
  };

  // Facilitator Ticket Creation events for modals
  const facilitatorFormUIEvents = {
    openDetailGridData: (masterId) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${masterId}/detail`);
    },
    openDetailTimeLog: (detailId) => {
      history.push(`/task_assignment_timeline/read-all-task-assignment-timeline/${detailId}/detailtimelog`);
    },
    // Empty handlers for unused functions
    openTicketTimeLog: () => {},
    newFormButtonClick: () => {},
    openEditFormDialog: () => {},
    openDeleteFormDialog: () => {},
    openActiveFormDialog: () => {},
    openReadFormDialog: () => {},
    openReceiveFormDialog: () => {},
  };

  return (
    <TaskAssignmentTimelineUIProvider taskAssignmentTimelineUIEvents={taskAssignmentTimelineUIEvents}>
      {/* Detail Modal Route - Wrapped with FormUIProvider */}
      <Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:masterId/detail">
        {({ history, match }) => (
          <FormUIProvider FormUIEvents={facilitatorFormUIEvents}>
            <DetailData
              show={match != null}
              detailId={match && match.params.masterId}
              onHide={() => history.push("/task_assignment_timeline/read-all-task-assignment-timeline")}
            />
          </FormUIProvider>
        )}
      </Route>

      {/* Detail Time Log Modal Route - Wrapped with FormUIProvider */}
      <Route path="/task_assignment_timeline/read-all-task-assignment-timeline/:detailId/detailtimelog">
        {({ history, match }) => (
          <FormUIProvider FormUIEvents={facilitatorFormUIEvents}>
            <DetailTimeLog
              show={match != null}
              detailId={match && match.params.detailId}
              onHide={() => history.push("/task_assignment_timeline/read-all-task-assignment-timeline")}
            />
          </FormUIProvider>
        )}
      </Route>

      {/* Task Assignment Timeline List / Card */}
      <FormCard />

      {/* Toast notifications */}
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