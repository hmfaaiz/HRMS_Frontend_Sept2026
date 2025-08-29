import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BanksUIProvider } from "./BanksUIContext";
import { BankEditDialog } from "./bank-edit-dialog/BankEditDialog";
import { BankDeleteDialog } from "./bank-delete-dialog/BankDeleteDialog";
import { BankActiveDialog } from "./bank-active-dialog/BankActiveDialog";
import { BanksCard } from "./bank-card/BanksCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
  fetchCenters,
} from "../../_redux/bankActions";
import { EmpHistDialog } from "./bank-edit-dialog/EmpHistDialog";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function EmployeeTransferPage({ history }) {
  const dispatch = useDispatch();
  const BanksUIEvents = {
  
    
    newBankButtonClick: () => {

      history.push("/employee_transfer/read-all-employee-transfer/new");
    }, 
    openEditBankDialog: (id) => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/edit`);
    },
    openEmpHistDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/history`);
    },
    openDeleteBankDialog: (id, status) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/delete`);
    },
    openActiveBankDialog: (id) => {
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/active`);
    },
    openReadBankDialog: (id, isUserRead) => {

      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/employee_transfer/read-all-employee-transfer/${id}/read`);
    },
  };
  return (

    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <Route exact path="/employee_transfer/read-all-employee-transfer/new">
        {({ history, match }) => (
          <BankEditDialog
            show={match != null}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>
      <Route path="/employee_transfer/read-all-employee-transfer/:id/edit">
        {({ history, match }) => (
          <BankEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>
      <Route path="/employee_transfer/read-all-employee-transfer/:id/read">
        {({ history, match }) => (
          <BankEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>
      <Route path="/employee_transfer/read-all-employee-transfer/:id/:status/delete">
        {({ history, match }) => (
          <BankDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>
      <Route path="/employee_transfer/read-all-employee-transfer/:id/active">
        {({ history, match }) => (
          <BankActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>

      <Route path="/employee_transfer/read-all-employee-transfer/:id/history">
        {({ history, match }) => (
          <EmpHistDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/employee_transfer/read-all-employee-transfer");
            }}
          />
        )}
      </Route>
      {/* <Route path="/employee_transfer/create-employee-transfer">
        {({ history, match }) => (
          <EmployeeHistoryDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/employee_transfer/create-employee-transfer");
            }}
          />
        )}
      </Route> */}
      <BanksCard />
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
