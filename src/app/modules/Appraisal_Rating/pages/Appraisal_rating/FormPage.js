import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/appraisal_rating/read-all-appraisal-rating/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/appraisal_rating/read-all-appraisal-rating/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(
        `/appraisal_rating/read-all-appraisal-rating/${id}/${status}/delete`
      );
    },
    openActiveFormDialog: (id) => {
      history.push(
        `/appraisal_rating/read-all-appraisal-rating/${id}/active`
      );
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/appraisal_rating/read-all-appraisal-rating/${id}/read`);
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/appraisal_rating/read-all-appraisal-rating/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/appraisal_rating/read-all-appraisal-rating");
            }}
          />
        )}
      </Route>
      <Route path="/appraisal_rating/read-all-appraisal-rating/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/appraisal_rating/read-all-appraisal-rating");
            }}
          />
        )}
      </Route>
      <Route path="/appraisal_rating/read-all-appraisal-rating/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/appraisal_rating/read-all-appraisal-rating");
            }}
          />
        )}
      </Route>
      <Route path="/appraisal_rating/read-all-appraisal-rating/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/appraisal_rating/read-all-appraisal-rating");
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
