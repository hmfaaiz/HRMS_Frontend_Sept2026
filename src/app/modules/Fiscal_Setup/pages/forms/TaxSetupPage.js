import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormActiveDialog } from "./form-active-dialog/FormActiveDialog";
import { FormCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
 
} from "../../_redux/formActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function FiscalSetupPage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/fiscal_setup/read-all-fiscal-setup/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/fiscal_setup/read-all-fiscal-setup/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/fiscal_setup/read-all-fiscal-setup/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/fiscal_setup/read-all-fiscal-setup/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/fiscal_setup/read-all-fiscal-setup/${id}/read`);
    },
  };
  return (
    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/fiscal_setup/read-all-fiscal-setup/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/fiscal_setup/read-all-fiscal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/fiscal_setup/read-all-fiscal-setup/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/fiscal_setup/read-all-fiscal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/fiscal_setup/read-all-fiscal-setup/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/fiscal_setup/read-all-fiscal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/fiscal_setup/read-all-fiscal-setup/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/fiscal_setup/read-all-fiscal-setup");
            }}
          />
        )}
      </Route>
      <Route path="/fiscal_setup/read-all-fiscal-setup/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/fiscal_setup/read-all-fiscal-setup");
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
