import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "../reimbursement_claim_approval/FormUIContext";
import { FormCard } from "../../pages/reimbursement_claim_approval/form-card/FormCard";

export function ReimbursementApprovalPage() {
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