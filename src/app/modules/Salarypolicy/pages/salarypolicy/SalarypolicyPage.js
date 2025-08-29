import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SalarypolicyUIProvider } from "./SalarypolicyUIContext";
import { SalarypolicyEditDialog } from "./salarypolicy-edit-dialog/SalarypolicyEditDialog";
import { SalarypolicyDeleteDialog } from "./salarypolicy-delete-dialog/SalarypolicyDeleteDialog";

import { SalarypolicyCard } from "./salarypolicy-card/SalarypolicyCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";
import {} from "../../_redux/salarypolicyActions";



export function SalarypolicyPage({ history }) {
  const dispatch = useDispatch();
  const SalarypolicyUIEvents = {
    newSalarypolicyButtonClick: () => {
      dispatch(fetchAllCountry());

      history.push("/salary_policy/read-all-salarypolicy/new");
    },
    openEditSalarypolicyDialog: (id) => {
      dispatch(fetchAllCountry());

      history.push(`/salary_policy/read-all-salarypolicy/${id}/edit`);
    },
    openDeleteSalarypolicyDialog: (id, status) => {
      history.push(`/salary_policy/read-all-salarypolicy/${id}/${status}/delete`);
    },
    openActiveSalarypolicyDialog: (id) => {
      history.push(`/salary_policy/read-all-salarypolicy/${id}/active`);
    },
    openReadSalarypolicyDialog: (id, isUserRead) => {
      
      
      history.push(`/salary_policy/read-all-salarypolicy/${id}/read`);
    },
  };
  return (
    
    <SalarypolicyUIProvider SalarypolicyUIEvents={SalarypolicyUIEvents}>
      <Route exact path="/salary_policy/read-all-salarypolicy/new">
        {({ history, match }) => (
          <SalarypolicyEditDialog
            show={match != null}
            onHide={() => {
              history.push("/salary_policy/read-all-salarypolicy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_policy/read-all-salarypolicy/:id/edit">
        {({ history, match }) => (
          <SalarypolicyEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/salary_policy/read-all-salarypolicy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_policy/read-all-salarypolicy/:id/read">
        {({ history, match }) => (
          <SalarypolicyEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/salary_policy/read-all-salarypolicy");
            }}
          />
        )}
      </Route>
      <Route path="/salary_policy/read-all-salarypolicy/:id/:status/delete">
        {({ history, match }) => (
          <SalarypolicyDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/salary_policy/read-all-salarypolicy");
            }}
          />
        )}
      </Route>
    
      <SalarypolicyCard />
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
    </SalarypolicyUIProvider>
  );
}
