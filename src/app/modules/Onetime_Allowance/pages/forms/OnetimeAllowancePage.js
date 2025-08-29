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

export function OnetimeAllowancePage({ history }) {
  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
 
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/onetime_earning/read-all-onetime-earning/new");
    },
    openEditFormDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
     
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/onetime_earning/read-all-onetime-earning/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/onetime_earning/read-all-onetime-earning/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/onetime_earning/read-all-onetime-earning/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/onetime_earning/read-all-onetime-earning/${id}/read`);
    },
  };
  return (
    
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/onetime_earning/read-all-onetime-earning/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/onetime_earning/read-all-onetime-earning");
            }}
          />
        )}
      </Route>
      <Route path="/onetime_earning/read-all-onetime-earning/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/onetime_earning/read-all-onetime-earning");
            }}
          />
        )}
      </Route>
      <Route path="/onetime_earning/read-all-onetime-earning/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/onetime_earning/read-all-onetime-earning");
            }}
          />
        )}
      </Route>
      <Route path="/onetime_earning/read-all-onetime-earning/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/onetime_earning/read-all-onetime-earning");
            }}
          />
        )}
      </Route>
      <Route path="/onetime_earning/read-all-onetime-earning/:id/active">
        {({ history, match }) => (
          <FormActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/onetime_earning/read-all-onetime-earning");
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
