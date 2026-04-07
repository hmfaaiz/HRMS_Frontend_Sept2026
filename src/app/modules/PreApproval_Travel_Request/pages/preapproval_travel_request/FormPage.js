import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { fetchAllCountry } from "../../../../../_metronic/redux/dashboardActions";

export function FormPage({ history }) {
  const dispatch = useDispatch();

  const FormUIEvents = useMemo(() => {
    return {
      newFormButtonClick: () => {
        dispatch(fetchAllCountry());
      },
      openEditFormDialog: (id) => {
        dispatch(fetchAllCountry());
      },
      openDeleteFormDialog: (id, status) => {
        history.push(`/preapproval_travel_request/read-all-preapproval-travel-request/delete/${id}`);
      },
      openReadFormDialog: (id) => {
        // No longer used with inline forms
      },
      openActiveFormDialog: (id, status) => {
        // No longer used with inline forms
      },
    };
  }, [dispatch, history]);

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route path="/preapproval_travel_request/read-all-preapproval-travel-request/delete/:id">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/preapproval_travel_request/read-all-preapproval-travel-request");
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
