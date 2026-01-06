import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newButtonClick: () => {
      history.push("/emp_appraisal/appraisal-review-finalization/new");
    },
    openEditDialog: (id) => {
      history.push(`/emp_appraisal/appraisal-review-finalization/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/emp_appraisal/appraisal-review-finalization/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/emp_appraisal/appraisal-review-finalization/${id}/read`);
    },
  };
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
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
