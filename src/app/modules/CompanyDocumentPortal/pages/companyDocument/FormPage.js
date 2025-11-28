import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/company_doc_portal/read-all-company-doc-portal/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/company_doc_portal/read-all-company-doc-portal/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/company_doc_portal/read-all-company-doc-portal/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/company_doc_portal/read-all-company-doc-portal/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/company_doc_portal/read-all-company-doc-portal/${id}/read`);
    },
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
