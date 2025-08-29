import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BanksUIProvider } from "./ReligionUIContext";
import { ReligionEditDialog } from "./religion-edit-dialog/ReligionEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { BankActiveDialog } from "./bank-active-dialog/BankActiveDialog";
// import { RegionPage } from "./region-card/RegionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/regionActions";
import { RegionCard } from "./region-card/RegionCard";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function RegionPage({ history }) {
  const dispatch = useDispatch();
  const BanksUIEvents = {
    newBankButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
     
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/region/read-all-region/new");
    },
    openEditBankDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
 
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/region/read-all-region/${id}/edit`);
    },
    openDeleteBankDialog: (id, status) => {
      history.push(`/region/read-all-region/${id}/${status}/delete`);
    },
    openActiveBankDialog: (id) => {
      history.push(`/region/read-all-region/${id}/active`);
    },
    openReadBankDialog: (id, isUserRead) => {
      
      // dispatch(());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/region/read-all-region/${id}/read`);
    },
  };
  return (
    
    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <Route exact path="/region/read-all-region/new">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            onHide={() => {
              history.push("/region/read-all-region");
            }}
          />
        )}
      </Route>
      <Route path="/region/read-all-region/:id/edit">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/region/read-all-region");
            }}
          />
        )}
      </Route>
      <Route path="/region/read-all-region/:id/read">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/region/read-all-region");
            }}
          />
        )}
      </Route>
      <Route path="/region/read-all-region/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/region/read-all-region");
            }}
          />
        )}
      </Route>
      <Route path="/region/read-all-region/:id/active">
        {({ history, match }) => (
          <BankActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/region/read-all-region");
            }}
          />
        )}
      </Route>
      <RegionCard />
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
