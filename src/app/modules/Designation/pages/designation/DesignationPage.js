import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DesignationUIProvider } from "./DesignationUIContext";
import { DesignationEditDialog } from "./designation-edit-dialog/DesignationEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { DesignationActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { ReligionCard } from "./religion-card/ReligionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
  fetchCenters,
} from "../../_redux/designationActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function DesignationPage({ history }) {
  const dispatch = useDispatch();
  const DesignationUIEvents = {
    newDesignationButtonClick: () => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/designation/read-all-designation/new");
    },
    openEditDesignationDialog: (id) => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/designation/read-all-designation/${id}/edit`);
    },
    openDeleteDesignationDialog: (id, status) => {
      history.push(`/designation/read-all-designation/${id}/${status}/delete`);
    },
    openActiveDesignationDialog: (id) => {
      history.push(`/designation/read-all-designation/${id}/active`);
    },
    openReadDesignationDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/designation/read-all-designation/${id}/read`);
    },
  };
  return (
    
    <DesignationUIProvider DesignationUIEvents={DesignationUIEvents}>
      <Route exact path="/designation/read-all-designation/new">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            onHide={() => {
              history.push("/designation/read-all-designation");
            }}
          />
        )}
      </Route>
      <Route path="/designation/read-all-designation/:id/edit">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/designation/read-all-designation");
            }}
          />
        )}
      </Route>
      <Route path="/designation/read-all-designation/:id/read">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/designation/read-all-designation");
            }}
          />
        )}
      </Route>
      <Route path="/designation/read-all-designation/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/designation/read-all-designation");
            }}
          />
        )}
      </Route>
      <Route path="/designation/read-all-designation/:id/active">
        {({ history, match }) => (
          <DesignationActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/designation/read-all-designation");
            }}
          />
        )}
      </Route>
      <ReligionCard />
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
    </DesignationUIProvider>
  );
}
