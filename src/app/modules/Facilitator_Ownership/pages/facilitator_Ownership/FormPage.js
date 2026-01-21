import React from "react";
import { FormCard } from "./form-card/FormCard";
import { FormUIProvider } from "./FormUIContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function FormPage() {
  const FormUIEvents = {
   
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
