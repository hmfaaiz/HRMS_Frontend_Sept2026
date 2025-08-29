import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BranchUIProvider } from "./BranchUIContext";
import { BranchEditDialog } from "./branch-edit-dialog/BranchEditDialog";
import { BranchDeleteDialog } from "./branch-delete-dialog/BranchDeleteDialog";
import { BranchActiveDialog } from "./bank-active-dialog/BranchActiveDialog";
import { BranchCard } from "./branch-card/BranchCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {
  fetchUserStatusTypes,
  fetchRoles,
  fetchCenters,
} from "../../_redux/branchActions";


// dispatch(actions.fetchRoles());
//     dispatch(actions.fetchCenters());

export function BranchPage({ history }) {
  const dispatch = useDispatch();
  const BranchUIEvents = {
    newBranchButtonClick: () => {
      dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push("/branch/read-all-branch/new");
    },
    openEditBranchDialog: (id) => {
      dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/branch/read-all-branch/${id}/edit`);
    },
    openDeleteBranchDialog: (id, status) => {
      history.push(`/branch/read-all-branch/${id}/${status}/delete`);
    },
    openActiveBranchDialog: (id) => {
      history.push(`/branch/read-all-branch/${id}/active`);
    },
    openReadBranchDialog: (id, isUserRead) => {
      
      // dispatch(fetchAllCountry());
      // dispatch(fetchRoles());
      // dispatch(fetchCenters());
      // dispatch(fetchUserStatusTypes({ filter: { normal: true } }));
      history.push(`/branch/read-all-branch/${id}/read`);
    },
  };
  return (
    
    <BranchUIProvider BranchUIEvents={BranchUIEvents}>
      <Route exact path="/branch/read-all-branch/new">
        {({ history, match }) => (
          <BranchEditDialog
            show={match != null}
            onHide={() => {
              history.push("/branch/read-all-branch");
            }}
          />
        )}
      </Route>
      <Route path="/branch/read-all-branch/:id/edit">
        {({ history, match }) => (
          <BranchEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/branch/read-all-branch");
            }}
          />
        )}
      </Route>
      <Route path="/branch/read-all-branch/:id/read">
        {({ history, match }) => (
          <BranchEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/branch/read-all-branch");
            }}
          />
        )}
      </Route>
      <Route path="/branch/read-all-branch/:id/:status/delete">
        {({ history, match }) => (
          <BranchDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/branch/read-all-branch");
            }}
          />
        )}
      </Route>
      <Route path="/branch/read-all-branch/:id/active">
        {({ history, match }) => (
          <BranchActiveDialog
            show={match != null}
            id={match && match.params.id}
            //status={match && match.params.status}
            onHide={() => {
              history.push("/branch/read-all-branch");
            }}
          />
        )}
      </Route>
      <BranchCard />
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
    </BranchUIProvider>
  );
}
