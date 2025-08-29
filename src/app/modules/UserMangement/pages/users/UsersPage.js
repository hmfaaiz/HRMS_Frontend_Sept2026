import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UsersUIProvider } from "./UsersUIContext";
import { UsersEditDialog } from "./users-edit-dialog/UsersEditDialog";
import { UserDeleteDialog } from "./user-delete-dialog/UserDeleteDialog";
import { UserActiveDialog } from "./user-active-dialog/UserActiveDialog";
import { UsersCard } from "./users-card/UsersCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,

} from "../../_redux/usersActions";

// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function UsersPage({ history }) {
  const dispatch = useDispatch();
  const usersUIEvents = {
    newUserButtonClick: () => {
     
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());

      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/users/read-all-users/new");
    },
    openEditUserDialog: (id) => {
    
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
   
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/users/read-all-users/${id}/edit`);
    },
    openDeleteUserDialog: (id, status) => {
      history.push(`/users/read-all-users/${id}/${status}/delete`);
    },
    openActiveUserDialog: (id) => {
      history.push(`/users/read-all-users/${id}/active`);
    },
    openReadUserDialog: (id, isUserRead) => {
      dispatch(fetchAllCountry());
      dispatch(fetchRoles());
  
      dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/users/read-all-users/${id}/read`);
    },
  };
  return (
    <UsersUIProvider usersUIEvents={usersUIEvents}>
      <Route exact path="/users/read-all-users/new">
        {({ history, match }) => (
          <UsersEditDialog
            show={match != null}
            onHide={() => {
              history.push("/users/read-all-users");
            }}
          />
        )}
      </Route>
      <Route path="/users/read-all-users/:id/edit">
        {({ history, match }) => (
          <UsersEditDialog
            show={match != null}
            isPasswordHide={true}
            id={match && match.params.id}
            onHide={() => {
              history.push("/users/read-all-users");
            }}
          />
        )}
      </Route>

      <Route path="/users/read-all-users/:id/read">
        {({ history, match }) => (
          <UsersEditDialog
            show={match != null}
            isPasswordHide={true}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/users/read-all-users");
            }}
          />
        )}
      </Route>
      <Route path="/users/read-all-users/:id/:status/delete">
        {({ history, match }) => (
          <UserDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/users/read-all-users");
            }}
          />
        )}
      </Route>
      <Route path="/users/read-all-users/:id/active">
        {({ history, match }) => (
          <UserActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/users/read-all-users");
            }}
          />
        )}
      </Route>
      <UsersCard />
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
    </UsersUIProvider>
  );
}
