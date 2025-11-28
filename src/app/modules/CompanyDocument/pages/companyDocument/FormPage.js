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

  console.log("yes111")

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/company_doc/read-all-company-doc/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/company_doc/read-all-company-doc/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/company_doc/read-all-company-doc/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/company_doc/read-all-company-doc/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/company_doc/read-all-company-doc/${id}/read`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/company_doc/read-all-company-doc/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/company_doc/read-all-company-doc");
            }}
          />
        )}
      </Route>
      <Route path="/company_doc/read-all-company-doc/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/company_doc/read-all-company-doc");
            }}
          />
        )}
      </Route>
      <Route path="/company_doc/read-all-company-doc/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/company_doc/read-all-company-doc");
            }}
          />
        )}
      </Route>
      <Route path="/company_doc/read-all-company-doc/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/company_doc/read-all-company-doc");
            }}
          />
        )}
      </Route>
    
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
