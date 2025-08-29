import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BanksUIProvider } from "./EmpTypeUIContext";
import { ReligionEditDialog } from "./religion-edit-dialog/ReligionEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { BankActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { ReligionCard } from "./religion-card/ReligionCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/employeeTypeActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function EmpTypePage({ history }) {
  const dispatch = useDispatch();
  const BanksUIEvents = {
    newBankButtonClick: () => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/emptype/read-all-emptype/new");
    },
    openEditBankDialog: (id) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
   
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/emptype/read-all-emptype/${id}/edit`);
    },
    openDeleteBankDialog: (id, status) => {
      history.push(`/emptype/read-all-emptype/${id}/${status}/delete`);
    },
    openActiveBankDialog: (id) => {
      history.push(`/emptype/read-all-emptype/${id}/active`);
    },
    openReadBankDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/emptype/read-all-emptype/${id}/read`);
    },
  };
  return (
    
    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <Route exact path="/emptype/read-all-emptype/new">
        {({ history, match }) => (
          <emptypeEditDialog
            show={match != null}
            onHide={() => {
              history.push("/emptype/read-all-emptype");
            }}
          />
        )}
      </Route>
      <Route path="/emptype/read-all-emptype/:id/edit">
        {({ history, match }) => (
          <emptypeEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/emptype/read-all-emptype");
            }}
          />
        )}
      </Route>
      <Route path="/emptype/read-all-emptype/:id/read">
        {({ history, match }) => (
          <ReligionEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/emptype/read-all-emptype");
            }}
          />
        )}
      </Route>
      <Route path="/emptype/read-all-emptype/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/emptype/read-all-emptype");
            }}
          />
        )}
      </Route>
      <Route path="/emptype/read-all-emptype/:id/active">
        {({ history, match }) => (
          <BankActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/emptype/read-all-emptype");
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
