import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider, useFormUIContext } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";
import { SelectTaxSetup } from "./form-card/Select-tax-setup";



export function FormPage({ history }) {



  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {

      history.push("/tax_slab/read-all-tax-slab/new");
    },
    openEditFormDialog: (id) => {

      history.push(`/tax_slab/read-all-tax-slab/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/tax_slab/read-all-tax-slab/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/tax_slab/read-all-tax-slab/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {


      history.push(`/tax_slab/read-all-tax-slab/${id}/read`);
    },
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/tax_slab/read-all-tax-slab/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/tax_slab/read-all-tax-slab");
            }}
          />
        )}
      </Route>
      <Route path="/tax_slab/read-all-tax-slab/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/tax_slab/read-all-tax-slab");
            }}
          />
        )}
      </Route>
      <Route path="/tax_slab/read-all-tax-slab/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/tax_slab/read-all-tax-slab");
            }}
          />
        )}
      </Route>
      <Route path="/tax_slab/read-all-tax-slab/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/tax_slab/read-all-tax-slab");
            }}
          />
        )}
      </Route>
 
      <FormCard/>
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
