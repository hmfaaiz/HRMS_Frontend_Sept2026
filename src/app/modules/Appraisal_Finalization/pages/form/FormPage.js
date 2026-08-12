import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import {Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormReadDialog } from "./form-read-dialog/FormReadDialog";
import { FormReadFiscalPeriodDialog } from "./form-read-fiiscal-period-dialog/FormReadFiscalPeriodDialog";

export function FormPage({ history }) {
  const location = useLocation();

  const FormUIEvents = {
    // ==================== READ ====================
    openReadDialog: (id) => {
      history.push({
        pathname:
          "/appraisal_finalization/read-all-appraisal-finalization/read",
        state: {
          id,
        },
      });
    },

    // ==================== FISCAL PERIOD ====================
    openReadFiscalPeriodDialog: (id) => {
      history.push({
        pathname:
          "/appraisal_finalization/read-all-appraisal-finalization/fiscal-period",
        state: {
          id,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      <FormCard />

      {/* ==================== READ ==================== */}
      <Route
        path="/appraisal_finalization/read-all-appraisal-finalization/read"
        render={({ history }) => (
          <FormReadDialog
            show={true}
            id={location.state?.id}
            onHide={() =>
              history.push(
                "/appraisal_finalization/read-all-appraisal-finalization"
              )
            }
          />
        )}
      />

      {/* ==================== FISCAL PERIOD ==================== */}
      <Route
        path="/appraisal_finalization/read-all-appraisal-finalization/fiscal-period"
        render={({ history }) => (
          <FormReadFiscalPeriodDialog
            show={true}
            id={location.state?.id}
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