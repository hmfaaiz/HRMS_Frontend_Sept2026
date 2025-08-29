import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
// import { FormActiveDialog } from "./form-active-dialog/FormActiveDialog";
// import { RegionPage } from "./region-card/RegionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/formActions";
import { FormCard } from "./form-card/FormCard";
import { FormActiveDialog } from "./form-active-dialog/FormActiveDialog";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/form/read-all-form/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/form/read-all-form/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/form/read-all-form/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/form/read-all-form/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/form/read-all-form/${id}/read`);
    },
  };
  return (
    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/form/read-all-form/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/form/read-all-form");
            }}
          />
        )}
      </Route>
      <Route path="/form/read-all-form/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/form/read-all-form");
            }}
          />
        )}
      </Route>
      <Route path="/form/read-all-form/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/form/read-all-form");
            }}
          />
        )}
      </Route>
      <Route path="/form/read-all-form/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/form/read-all-form");
            }}
          />
        )}
      </Route>
      <Route path="/form/read-all-form/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/form/read-all-form");
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
