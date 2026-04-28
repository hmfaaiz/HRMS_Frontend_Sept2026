// import React, { useMemo } from "react";
// import { Route } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FormUIProvider } from "./FormUIContext";
// import { FormCard } from "./form-card/FormCard";

// export function FormPage({ history }) {
//   const FormUIEvents = useMemo(() => ({
//     openDeleteFormDialog: (id) => {
//       history.push(
//         `/post_approval_travel_request/read-all-post-approval-travel-request/delete/${id}`,
//       );
//     },
//   }), [history]);

//   return (
//     <FormUIProvider FormUIEvents={FormUIEvents}>
//       <FormCard />
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
      
//     </FormUIProvider>
    
//   );
// }


import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider, useFormUIContext } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

export function FormPage({ history }) {
  const FormUIEvents = useMemo(() => ({}), []);

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormRoutes />
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

function FormRoutes() {
  const { idToDelete, closeDeleteDialog } = useFormUIContext();

  return (
    <>
      {idToDelete && (
        <FormDeleteDialog
          show={true}
          Id={idToDelete}
          onHide={closeDeleteDialog}
        />
      )}
    </>
  );
}