import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { Card } from "react-bootstrap";
import { Route } from "react-router-dom";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import { WorkflowAuthortiesTable } from "./form-table/WorkflowAuthoritesTable";
import { AttendanceSummary } from "./attendance-summary/AttendanceSummary";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";

export function AttendanceViewPage({ history }) {
  const FormUIEvents = {
    newAttendanceRequest: (Id) => {
      return history.push(
        `/attendance_request/read-all-attendance-request/${Id}/new`
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
         <Route path="/attendance_request/read-all-attendance-request/:Id/new">
              {({ history, match }) => (
                <FormEditDialog
                  show={match != null}
                  onHide={() => {
                    history.push("/attendance_request/read-all-attendance-request");
                  }}
                />
              )}
            </Route>
      <Card>
        {/* Card Starts */}

        <CardHeader title={CurrentModuleName()}></CardHeader>

        {/* Filter Form Starts */}
        <FormFilter />
        {/* Filter Form Ends */}

        {/* Table Starts */}
        <FormTable />
        {/* Table Ends */}
        {/* attendance summary  */}
        <AttendanceSummary />
        {/* authorites data  */}
        <WorkflowAuthortiesTable />
        {/* Card Ends */}
      </Card>

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
