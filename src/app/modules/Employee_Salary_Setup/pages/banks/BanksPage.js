
import React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { Route, useLocation } from "react-router-dom";
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

// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function EmployeeSalarySetupPage({ history }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const BanksUIEvents = {
    newBankButtonClick: () => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/employee_salary/read-all-employee-salary/new");
    },

    openEditBankDialog: (id) => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));

      // history.push(`/employee_salary/read-all-employee-salary/${id}/edit`);
      history.push({
        pathname: "/employee_salary/read-all-employee-salary/edit",
        state: {
          id,
        },
      });
    },

    openDeleteBankDialog: (id, status) => {
      // history.push(`/employee_salary/read-all-employee-salary/${id}/${status}/delete`);
      history.push({
        pathname: "/employee_salary/read-all-employee-salary/delete",
        state: {
          id,
          status,
        },
      });
    },

    openActiveBankDialog: (id) => {
      // history.push(`/employee_salary/read-all-employee-salary/${id}/active`);
      history.push({
        pathname: "/employee_salary/read-all-employee-salary/active",
        state: {
          id,
        },
      });
    },

    openReadBankDialog: (id, isUserRead) => {
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));

      // history.push(`/employee_salary/read-all-employee-salary/${id}/read`);
      history.push({
        pathname: "/employee_salary/read-all-employee-salary/read",
        state: {
          id,
          isUserRead,
        },
      });
    },
  };

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.Employee_Salary,
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeSalary"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeSalary"
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateEmployeeSalary"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadEmployeeSalary"
  );

  return (
    // <BanksUIProvider BanksUIEvents={BanksUIEvents}>
    //   <Route exact path="/employee_salary/read-all-employee-salary/new">
    //     {({ history, match }) => (
    //       <BankEditDialog
    //         show={match != null}
    //         onHide={() => {
    //           history.push("/employee_salary/read-all-employee-salary");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/employee_salary/read-all-employee-salary/:id/edit">
    //     {({ history, match }) => (
    //       <BankEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         onHide={() => {
    //           history.push("/employee_salary/read-all-employee-salary");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/employee_salary/read-all-employee-salary/:id/read">
    //     {({ history, match }) => (
    //       <BankEditDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         userForRead={true}
    //         onHide={() => {
    //           history.push("/employee_salary/read-all-employee-salary");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/employee_salary/read-all-employee-salary/:id/:status/delete">
    //     {({ history, match }) => (
    //       <BankDeleteDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         status={match && match.params.status}
    //         onHide={() => {
    //           history.push("/employee_salary/read-all-employee-salary");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <Route path="/employee_salary/read-all-employee-salary/:id/active">
    //     {({ history, match }) => (
    //       <BankActiveDialog
    //         show={match != null}
    //         id={match && match.params.id}
    //         //status={match && match.params.status}
    //         onHide={() => {
    //           history.push("/employee_salary/read-all-employee-salary");
    //         }}
    //       />
    //     )}
    //   </Route>
    //   <BanksCard />
    //   <ToastContainer
    //     position="top-right"
    //     autoClose={5000}
    //     hideProgressBar={false}
    //     newestOnTop={false}
    //     closeOnClick
    //     rtl={false}
    //     pauseOnFocusLoss
    //     draggable
    //     pauseOnHover
    //   />
    // </BanksUIProvider>

    <BanksUIProvider BanksUIEvents={BanksUIEvents}>
      <BanksCard
        onHide={() =>
          history.push("/employee_salary/read-all-employee-salary")
        }
      />

      {accessUser && (
        <Route
          path="/employee_salary/read-all-employee-salary/new"
          render={({ match, history }) => (
            <BankEditDialog
              status="new"
              onHide={() =>
                history.push("/employee_salary/read-all-employee-salary")
              }
            />
          )}
        />
      )}

      {isAccessForEdit && (
        <Route
          // path="/employee_salary/read-all-employee-salary/:id/edit"
          path="/employee_salary/read-all-employee-salary/edit"
          render={({ match, history }) => (
            <BankEditDialog
              // id={match.params.id}
              id={location.state?.id}
              status="edit"
              onHide={() =>
                history.push("/employee_salary/read-all-employee-salary")
              }
            />
          )}
        />
      )}

      {isAccessForRead && (
        <Route
          // path="/employee_salary/read-all-employee-salary/:id/read"
          path="/employee_salary/read-all-employee-salary/read"
          render={({ match, history }) => (
            <BankEditDialog
              // id={match.params.id}
              id={location.state?.id}
              status="read"
              userForRead={true}
              onHide={() =>
                history.push("/employee_salary/read-all-employee-salary")
              }
            />
          )}
        />
      )}

      {isAccessForDelete && (
        <Route
          // path="/employee_salary/read-all-employee-salary/:id/:status/delete"
          path="/employee_salary/read-all-employee-salary/delete"
        >
          {({ history, match }) => (
            <BankDeleteDialog
              show={match != null}
              // id={match && match.params.id}
              id={location.state?.id}
              // status={match && match.params.status}
              status={location.state?.status}
              onHide={() => {
                history.push("/employee_salary/read-all-employee-salary");
              }}
            />
          )}
        </Route>
      )}

      {/* may be not in used */}
      <Route
        // path="/employee_salary/read-all-employee-salary/:id/active"
        path="/employee_salary/read-all-employee-salary/active"
      >
        {({ history, match }) => (
          <BankActiveDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/employee_salary/read-all-employee-salary");
            }}
          />
        )}
      </Route>

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

