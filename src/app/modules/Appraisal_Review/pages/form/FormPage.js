import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const location = useLocation();

  const FormUIEvents = {
    // NEW
    newButtonClick: () => {
      history.push(
        "/appraisal_review/read-all-appraisal-review/new"
      );
    },

    // EDIT
    openEditDialog: (id) => {
      history.push({
        pathname:
          "/appraisal_review/read-all-appraisal-review/edit",
        state: {
          id,
        },
      });
    },

    // DELETE
    openDeleteDialog: (id, status) => {
      history.push({
        pathname:
          "/appraisal_review/read-all-appraisal-review/delete",
        state: {
          id,
          status,
        },
      });
    },

    // READ
    openReadDialog: (id) => {
      history.push({
        pathname:
          "/appraisal_review/read-all-appraisal-review/read",
        state: {
          id,
        },
      });
    },
  };

  const { userAccess } = useSelector(
    (state) => ({
      userAccess:
        state?.auth?.userAccess?.appraisal_review || [],
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find(
    (item) =>
      item.componentName === "UpdateAppraisalReview"
  );

  const isAccessForDelete = userAccess?.find(
    (item) =>
      item.componentName === "DeleteAppraisalReview"
  );

  const accessUser = userAccess?.find(
    (item) =>
      item.componentName === "CreateAppraisalReview"
  );

  const isAccessForRead = userAccess?.find(
    (item) =>
      item.componentName === "ReadAppraisalReview"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      <FormCard />

      {/* ==================== NEW ==================== */}
      {accessUser && (
        <Route
          exact
          path="/appraisal_review/read-all-appraisal-review/new"
          render={({ history }) => (
            <FormEditDialog
              show={true}
              status="new"
              onHide={() =>
                history.push(
                  "/appraisal_review/read-all-appraisal-review"
                )
              }
            />
          )}
        />
      )}

      {/* ==================== EDIT ==================== */}
      {isAccessForEdit && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/edit"
          render={({ history }) => (
            <FormEditDialog
              show={true}
              id={location.state?.id}
              status="edit"
              onHide={() =>
                history.push(
                  "/appraisal_review/read-all-appraisal-review"
                )
              }
            />
          )}
        />
      )}

      {/* ==================== READ ==================== */}
      {isAccessForRead && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/read"
          render={({ history }) => (
            <FormEditDialog
              show={true}
              id={location.state?.id}
              status="read"
              userForRead={true}
              onHide={() =>
                history.push(
                  "/appraisal_review/read-all-appraisal-review"
                )
              }
            />
          )}
        />
      )}

      {/* ==================== DELETE ==================== */}
      {isAccessForDelete && (
        <Route
          path="/appraisal_review/read-all-appraisal-review/delete"
          render={({ history }) => (
            <BankDeleteDialog
              show={true}
              id={location.state?.id}
              status={location.state?.status}
              onHide={() =>
                history.push(
                  "/appraisal_review/read-all-appraisal-review"
                )
              }
            />
          )}
        />
      )}

      {/* ==================== TOAST ==================== */}
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