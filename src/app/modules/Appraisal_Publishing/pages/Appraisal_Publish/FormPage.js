import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";
import { FormPublishDialog } from "./form-publish-dialog/FormPublishDialog";
import { FormHoldDialog } from "./form-hold-dialog/FormHoldDialog";

export function FormPage({ history }) {
  const FormUIEvents = {
    openPublishFormDialog: (id) => {
      history.push(
        `/appraisal_publish/read-all-appraisal-publish/${id}/publish`
      );
    },
    openHoldFormDialog: (id , status) => {
      history.push(`/appraisal_publish/read-all-appraisal-publish/${id}/${status}/hold`);
    },
    openDeleteFormDialog: (id) => {
      history.push(
        `/appraisal_publish/read-all-appraisal-publish/${id}/delete`
      );
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/appraisal_publish/read-all-appraisal-publish/:id/publish">
        {({ history, match }) => (
          <FormPublishDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      <Route path="/appraisal_publish/read-all-appraisal-publish/:id/:status/hold">
        {({ history, match }) => (
          <FormHoldDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      <Route path="/appraisal_publish/read-all-appraisal-publish/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
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
