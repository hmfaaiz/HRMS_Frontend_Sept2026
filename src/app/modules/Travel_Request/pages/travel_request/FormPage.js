import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";

import { FormCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = useMemo(() => {
    return {
      newFormButtonClick: () => {
        dispatch(fetchAllCountry());
      },
    };
  }, [dispatch]);

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
