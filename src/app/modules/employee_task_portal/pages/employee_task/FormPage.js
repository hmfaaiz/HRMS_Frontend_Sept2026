import React from "react";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function EmployeeTaskPage({ history }) {
  const formEvents = {};

  return (
    <FormUIProvider FormUIEvents={formEvents}>
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
