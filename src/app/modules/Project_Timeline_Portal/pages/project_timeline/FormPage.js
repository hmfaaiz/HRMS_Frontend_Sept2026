import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProjectTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const projectTimelineUIEvents = {
    newTicketButtonClick: (query = null) => {
      const url = `/ticket_setup_portal/read-all-ticket-setup/new${query ? query : ""}`;
      window.open(url, '_blank');  // Opens in a new tab
    },
    // Navigate to ticket activity page 
    openTicketActivity: (query = null) => {
      
        const url =`/ticket_activity_portal/read-ticket-activity${query ? query : ""}`;
        window.open(url, '_blank');
      
    },
  };

  return (
    <ProjectTimelineUIProvider projectTimelineUIEvents={projectTimelineUIEvents}>
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
    </ProjectTimelineUIProvider>
  );
}