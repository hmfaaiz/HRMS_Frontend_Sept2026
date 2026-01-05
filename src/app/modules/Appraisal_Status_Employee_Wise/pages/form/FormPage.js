import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";

export function FormPage() {
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.appraisal_status,
    }),
    shallowEqual
  );
  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAllAppraisalStatus"
  );
  return (
    <FormUIProvider>
      {isAccessForRead && <FormCard />}
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
