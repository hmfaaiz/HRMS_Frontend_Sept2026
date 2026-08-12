import React from "react";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";
import { FormPublishDialog } from "./form-publish-dialog/FormPublishDialog";
import { FormHoldDialog } from "./form-hold-dialog/FormHoldDialog";
import { FormAuthortiesDialog } from "./form-authorties-dialog/FormAuthortiesDialog";
import { FormDetailDialog } from "./form-detail-dialog/FormDetailDialog";

export function FormPage({ history }) {
  const location = useLocation();

  const FormUIEvents = {
    openPublishFormDialog: (id) => {
      // history.push(
      //   `/appraisal_publish/read-all-appraisal-publish/${id}/publish`
      // );

      history.push({
        pathname: "/appraisal_publish/read-all-appraisal-publish/publish",
        state: {
          id,
        },
      });
    },

    openHoldFormDialog: (id, status) => {
      // history.push(
      //   `/appraisal_publish/read-all-appraisal-publish/${id}/${status}/hold`
      // );

      history.push({
        pathname: "/appraisal_publish/read-all-appraisal-publish/hold",
        state: {
          id,
          status,
        },
      });
    },

    openDeleteFormDialog: (id) => {
      // history.push(
      //   `/appraisal_publish/read-all-appraisal-publish/${id}/delete`
      // );

      history.push({
        pathname: "/appraisal_publish/read-all-appraisal-publish/delete",
        state: {
          id,
        },
      });
    },

    openAuthortiesFormDialog: (id) => {
      // history.push(
      //   `/appraisal_publish/read-all-appraisal-publish/${id}/authorties`
      // );

      history.push({
        pathname: "/appraisal_publish/read-all-appraisal-publish/authorties",
        state: {
          id,
        },
      });
    },

    openDetailFormDialog: (id) => {
      // history.push(
      //   `/appraisal_publish/read-all-appraisal-publish/${id}/detail`
      // );

      history.push({
        pathname: "/appraisal_publish/read-all-appraisal-publish/detail",
        state: {
          id,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* PUBLISH */}
      <Route path="/appraisal_publish/read-all-appraisal-publish/publish">
        {({ history, match }) => (
          <FormPublishDialog
            show={match != null}

            // id={match && match.params.id}
            id={location.state?.id}

            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      {/* HOLD */}
      <Route path="/appraisal_publish/read-all-appraisal-publish/hold">
        {({ history, match }) => (
          <FormHoldDialog
            show={match != null}

            // id={match && match.params.id}
            // status={match && match.params.status}
            id={location.state?.id}
            status={location.state?.status}

            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      {/* DELETE */}
      <Route path="/appraisal_publish/read-all-appraisal-publish/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}

            // id={match && match.params.id}
            id={location.state?.id}

            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      {/* AUTHORTIES */}
      <Route path="/appraisal_publish/read-all-appraisal-publish/authorties">
        {({ history, match }) => (
          <FormAuthortiesDialog
            show={match != null}

            // id={match && match.params.id}
            id={location.state?.id}

            onHide={() => {
              history.push("/appraisal_publish/read-all-appraisal-publish");
            }}
          />
        )}
      </Route>

      {/* DETAIL */}
      <Route path="/appraisal_publish/read-all-appraisal-publish/detail">
        {({ history, match }) => (
          <FormDetailDialog
            show={match != null}

            // id={match && match.params.id}
            id={location.state?.id}

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