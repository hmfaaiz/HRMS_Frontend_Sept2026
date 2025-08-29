import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BanksUIProvider } from "./EmployeePolicyUIContext";
import { ReligionEditDialog } from "./religion-edit-dialog/ReligionEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { BankActiveDialog } from "./bank-active-dialog/BankActiveDialog";
// import { RegionPage } from "./region-card/RegionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
  
} from "../../_redux/regionActions";
import { EmpPolicyCard } from "./region-card/RegionCard";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function EmpPolicyPage({ history }) {
  const dispatch = useDispatch();
  const BanksUIEvents = {
    newBankButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
   
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/policy/read-all-policy/new");
    },
    openEditBankDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
   
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/policy/read-all-policy/${id}/edit`);
    },
    openDeleteBankDialog: (id, status) => {
      history.push(`/policy/read-all-policy/${id}/${status}/delete`);
    },
    openActiveBankDialog: (id) => {
      history.push(`/policy/read-all-policy/${id}/active`);
    },
    openReadBankDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/policy/read-all-policy/${id}/read`);
    },
  };
  return (
    
    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <Route exact path="/policy/read-all-policy/new">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <Route path="/policy/read-all-policy/:id/edit">
        {({ history, match }) => (
          <ReligionEditDialog
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
          <ReligionEditDialog
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
          <BankActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/policy/read-all-policy");
            }}
          />
        )}
      </Route>
      <EmpPolicyCard />
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
    </BanksUIProvider>
  );
}
