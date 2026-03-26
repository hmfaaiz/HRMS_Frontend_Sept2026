import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = useMemo(() => {
    return {
      newFormButtonClick: () => {
        dispatch(fetchAllCountry());
        history.push("/tada_config/read-all-tada-config/new");
      },
      openEditFormDialog: (id) => {
        dispatch(fetchAllCountry());
        history.push(`/tada_config/read-all-tada-config/${id}/edit`);
      },
      openDeleteFormDialog: (id, status) => {
        history.push(`/tada_config/read-all-tada-config/${id}/${status}/delete`);
      },
      openReadFormDialog: (id) => {
        history.push(`/tada_config/read-all-tada-config/${id}/read`);
      },
      openActiveFormDialog: (id, status) => {
        history.push(`/tada_config/read-all-tada-config/${id}/${status}/delete`);
      },
    };
  }, [dispatch, history]);

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/tada_config/read-all-tada-config/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/tada_config/read-all-tada-config");
            }}
          />
        )}
      </Route>
      <Route path="/tada_config/read-all-tada-config/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/tada_config/read-all-tada-config");
            }}
          />
        )}
      </Route>
      <Route path="/tada_config/read-all-tada-config/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/tada_config/read-all-tada-config");
            }}
          />
        )}
      </Route>
      <Route path="/tada_config/read-all-tada-config/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/tada_config/read-all-tada-config");
            }}
          />
        )}
      </Route>
    
      <FormCard />
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
    </FormUIProvider>
  );
}
