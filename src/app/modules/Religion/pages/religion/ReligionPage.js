import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BanksUIProvider } from "./ReligionUIContext";
import { ReligionEditDialog } from "./religion-edit-dialog/ReligionEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { BankActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { ReligionCard } from "./religion-card/ReligionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/religionActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function ReligionPage({ history }) {
  const dispatch = useDispatch();
  const BanksUIEvents = {
    newBankButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
  
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/religion/read-all-religion/new");
    },
    openEditBankDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
   
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/religion/read-all-religion/${id}/edit`);
    },
    openDeleteBankDialog: (id, status) => {
      history.push(`/religion/read-all-religion/${id}/${status}/delete`);
    },
    openActiveBankDialog: (id) => {
      history.push(`/religion/read-all-religion/${id}/active`);
    },
    openReadBankDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/religion/read-all-religion/${id}/read`);
    },
  };
  return (
    
    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <Route exact path="/religion/read-all-religion/new">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            onHide={() => {
              history.push("/religion/read-all-religion");
            }}
          />
        )}
      </Route>
      <Route path="/religion/read-all-religion/:id/edit">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/religion/read-all-religion");
            }}
          />
        )}
      </Route>
      <Route path="/religion/read-all-religion/:id/read">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/religion/read-all-religion");
            }}
          />
        )}
      </Route>
      <Route path="/religion/read-all-religion/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/religion/read-all-religion");
            }}
          />
        )}
      </Route>
      <Route path="/religion/read-all-religion/:id/active">
        {({ history, match }) => (
          <BankActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/religion/read-all-religion");
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
    </BanksUIProvider>
  );
}
