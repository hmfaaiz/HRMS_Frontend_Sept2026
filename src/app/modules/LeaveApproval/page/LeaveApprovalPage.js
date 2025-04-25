import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "../page/form/form-card/FormCard";
import { LeaveBalanceTable } from "./form/form-table/LeaveBalanceTable";
import { Route } from "react-router-dom";
import { LeaveWorkflowTable } from "./form/form-table/LeaveWorkflowTable";
export function LeaveApprovalPage({ history }) {
  const FormUIEvents = {
    // openLeaveBalanceDialog: (empId) => {
    //   history.push(
    //     `/leave-approval/read-all-leave-approval/${empId}/leave-balance`
    //   );
    // },
    // openLeaveWorkflowDialog: (Id) => {
    //   history.push(`/leave-approval/read-all-leave-approval/${Id}/workflow`);
    // },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      {/* <Route path="/leave-approval/read-all-leave-approval/:empId/leave-balance">
        {({ history, match }) => (
          <LeaveBalanceTable
            show={match != null}
            onHide={() => {
              history.push("/leave-approval/read-all-leave-approval");
            }}
          />
        )}
      </Route>
      <Route path="/leave-approval/read-all-leave-approval/:Id/workflow">
        {({ history, match }) => (
          <LeaveWorkflowTable
            show={match != null}
            onHide={() => {
              history.push("/leave-approval/read-all-leave-approval");
            }}
          />
        )}
      </Route> */}
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
