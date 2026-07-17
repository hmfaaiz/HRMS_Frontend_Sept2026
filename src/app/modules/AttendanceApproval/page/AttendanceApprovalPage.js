import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "../page/form/form-card/FormCard";
import { Route } from "react-router-dom";
import { FormEditDialog } from "./form/form-edit-dialog/FormEditDialog";

export function AttendanceApprovalPage({ history }) {
  const FormUIEvents = {
    attendanceRequest: (Id) => {
      return history.push(
        `/attendance_approval/read-all-attendance-approval/${Id}/new`,
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/attendance_approval/read-all-attendance-approval/:Id/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/attendance_approval/read-all-attendance-approval");
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
