import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newButtonClick: () => {
      history.push("/appraisal_review/read-all-appraisal-review/new");
    },
    openEditDialog: (id) => {
      history.push(`/appraisal_review/read-all-appraisal-review/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/appraisal_review/read-all-appraisal-review/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/appraisal_review/read-all-appraisal-review/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.appraisal_review,
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAppraisalReview"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteAppraisalReview"
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAppraisalReview"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAppraisalReview"
  );
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormCard />
      {accessUser && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/new"
          render={({ match, history }) => (
            <FormEditDialog
              status="new"
              onHide={() =>
                history.push("/appraisal_review/read-all-appraisal-review")
              }
            />
          )}
        />
      )}

      {isAccessForEdit && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/:id/edit"
          render={({ match, history }) => (
            <FormEditDialog
              id={match.params.id}
              status="edit"
              onHide={() =>
                history.push("/appraisal_review/read-all-appraisal-review")
              }
            />
          )}
        />
      )}

      {isAccessForRead && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/:id/read"
          render={({ match, history }) => (
            <FormEditDialog
              id={match.params.id}
              status="read"
              userForRead={true}
              onHide={() =>
                history.push("/appraisal_review/read-all-appraisal-review")
              }
            />
          )}
        />
      )}

      {isAccessForDelete && (
        <Route path="/appraisal_review/read-all-appraisal-review/:id/delete">
          {({ history, match }) => (
            <BankDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/appraisal_review/read-all-appraisal-review");
              }}
            />
          )}
        </Route>
      )}

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
