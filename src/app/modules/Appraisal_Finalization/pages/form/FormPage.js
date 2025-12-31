import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormReadDialog } from "./form-read-dialog/FormReadDialog";
import { FormReadFiscalPeriodDialog } from "./form-read-fiiscal-period-dialog/FormReadFiscalPeriodDialog";

export function FormPage({ history }) {
  const FormUIEvents = {
    openReadDialog: (id) => {
      history.push(
        `/appraisal_finalization/read-all-appraisal-finalization/${id}/read`
      );
    },
    openReadFiscalPeriodDialog: (id) => {
      history.push(
        `/appraisal_finalization/read-all-appraisal-finalization/${id}/fiscal-period`
      );
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormCard />

      <Route
        path="/appraisal_finalization/read-all-appraisal-finalization/:id/read"
        render={({ match, history }) => (
          <FormReadDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push(
                "/appraisal_finalization/read-all-appraisal-finalization"
              )
            }
          />
        )}
      />

      <Route
        path="/appraisal_finalization/read-all-appraisal-finalization/:id/fiscal-period"
        render={({ match, history }) => (
          <FormReadFiscalPeriodDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() =>
              history.push(
                "/appraisal_finalization/read-all-appraisal-finalization"
              )
            }
          />
        )}
      />

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
