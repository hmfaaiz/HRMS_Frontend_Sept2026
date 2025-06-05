import React from "react";
import { ToastContainer } from "react-toastify";
import { FormUIProvider } from "./FormUIContext";
import FormCard from "./form_card/FormCard";

export function FormPage({ history }) {

  const formEvents = {
    newInterview: () => {
      history.push("/job_offer/read-job-offer/new");
    },
    editInterview: (Id) => {
      history.push(`/job_offer/read-job-offer/${Id}/edit`);
    },
    viewInterview: (Id) => {
      history.push(`/job_offer/read-job-offer/${Id}/view`);
    },
  };

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
