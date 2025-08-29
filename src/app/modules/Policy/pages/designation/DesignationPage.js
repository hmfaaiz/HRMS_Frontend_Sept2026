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

export function PolicyPage({ history }) {
  const dispatch = useDispatch();
  const DesignationUIEvents = {
    newDesignationButtonClick: () => {
     
      history.push("/policy/read-all-policy/new");
    },
    openEditDesignationDialog: (id) => {
      history.push(`/policy/read-all-policy/${id}/edit`);
    },
    openDeleteDesignationDialog: (id, status) => {
      history.push(`/policy/read-all-policy/${id}/${status}/delete`);
    },
    openActiveDesignationDialog: (id) => {
      history.push(`/policy/read-all-policy/${id}/active`);
    },
    openReadDesignationDialog: (id, isUserRead) => {
      history.push(`/policy/read-all-policy/${id}/read`);
    },
  };
  return (
    
    <DesignationUIProvider DesignationUIEvents={DesignationUIEvents}>
      <Route exact path="/policy/read-all-policy/new">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <Route path="/policy/read-all-policy/:id/edit">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <Route path="/policy/read-all-policy/:id/read">
        {({ history, match }) => (
          <DesignationEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <Route path="/policy/read-all-policy/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <Route path="/policy/read-all-policy/:id/active">
        {({ history, match }) => (
          <DesignationActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/policy/read-all-policy");
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
