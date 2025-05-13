import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import { FormFilter } from "./form-filter/FormFilter";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";

export function PayrollRegisterPage() {
  const dispatch = useDispatch();
  const {
    pdfLoading,
  } = useSelector((state) => ({
    pdfLoading: state.payroll_preview.pdfLoading,
  }));


  return (
    <FormUIProvider FormUIEvents={{}}>
      <Card>
        {/* Card Starts */}

        <CardHeader title={CurrentModuleName()}></CardHeader>

        {/* Filter Form Starts */}
        <FormFilter pdfLoading={pdfLoading} dispatch={dispatch} />
        {/* Filter Form Ends */}
        {/* Card Ends */}
      </Card>
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
