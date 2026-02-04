import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProjectTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";

export function FormPage() {
  return (
    <ProjectTimelineUIProvider>
      {/* Project Timeline List / Card */}
      <FormCard />

      {/* Optional Toast notifications */}
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
    </ProjectTimelineUIProvider>
  );
}
