import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormCard } from "./form-card/FormCard";
import { FormAnalyticsDialog } from "./form-analytics-dialog/FormAnalyticsDialog";

export function FormPage({ history }) {
  const FormUIEvents = {
    openEditFormDialog: (id) => {
      history.push(
        `/appraisal_evaluation/read-all-appraisal-evaluation/${id}/edit`
      );
    },
    openReadFormDialog: (id) => {
      history.push(
        `/appraisal_evaluation/read-all-appraisal-evaluation/${id}/read`
      );
    },
    openAnalysisFormDialog: (empId , Id) => {
      history.push(
        `/appraisal_evaluation/read-all-appraisal-evaluation/${empId}/${Id}/employee-detail`
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/appraisal_evaluation/read-all-appraisal-evaluation/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push(
                "/appraisal_evaluation/read-all-appraisal-evaluation"
              );
            }}
          />
        )}
      </Route>
      <Route path="/appraisal_evaluation/read-all-appraisal-evaluation/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push(
                "/appraisal_evaluation/read-all-appraisal-evaluation"
              );
            }}
          />
        )}
      </Route>
      <Route path="/appraisal_evaluation/read-all-appraisal-evaluation/:empId/:id/employee-detail">
        {({ history, match }) => (
          <FormAnalyticsDialog
            show={match != null}
            id={match && match.params.id}
            empId={match && match.params.empId}
            onHide={() => {
              history.push(
                "/appraisal_evaluation/read-all-appraisal-evaluation"
              );
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
