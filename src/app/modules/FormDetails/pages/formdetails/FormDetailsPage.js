import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormDetailsUIContext";
import { FormEditDialog } from "./formdetails-edit-dialog/FormDetailsEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
// import { FormActiveDialog } from "./form-active-dialog/FormActiveDialog";
// import { RegionPage } from "./region-card/RegionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/formdetailsActions";
import { FormCard } from "./formdetails-card/FormDetailsCard";
import { FormActiveDialog } from "./formdetails-active-dialog/FormDetailsActiveDialog";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function FormDetailsPage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
  
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/formdetails/read-all-parent-forms/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
 
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/formdetails/read-all-parent-forms/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/formdetails/read-all-parent-forms/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/formdetails/read-all-parent-forms/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/formdetails/read-all-parent-forms/${id}/read`);
    },
  };
  return (
    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/formdetails/read-all-parent-forms/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/formdetails/read-all-parent-forms");
            }}
          />
        )}
      </Route>
      <Route path="/formdetails/read-all-parent-forms/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/formdetails/read-all-parent-forms");
            }}
          />
        )}
      </Route>
      <Route path="/formdetails/read-all-parent-forms/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/formdetails/read-all-parent-forms");
            }}
          />
        )}
      </Route>
      <Route path="/formdetails/read-all-parent-forms/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/formdetails/read-all-parent-forms");
            }}
          />
        )}
      </Route>
      <Route path="/formdetails/read-all-parent-forms/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/formdetails/read-all-parent-forms");
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
