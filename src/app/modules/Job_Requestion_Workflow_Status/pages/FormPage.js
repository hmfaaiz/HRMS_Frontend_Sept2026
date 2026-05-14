import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./job_requestion_workflow_status/FormUIContext";
import { FormCard } from "./job_requestion_workflow_status/form-card/FormCard";

export function JobRequestionWorkflowStatusPage() {
  return (
    <FormUIProvider FormUIEvents={{}}>
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