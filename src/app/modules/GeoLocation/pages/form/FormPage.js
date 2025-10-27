import React from "react";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/geo_location/read-all-geo-location/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/geo_location/read-all-geo-location/${id}/edit`);
    },
    openDeleteFormDialog: (id) => {
      history.push(`/geo_location/read-all-geo-location/${id}/delete`);
    },
    openReadFormDialog: (id) => {
      history.push(`/geo_location/read-all-geo-location/${id}/read`);
    },
  };
  
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/geo_location/read-all-geo-location/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            isNew={true}
            onHide={() => {
              history.push("/geo_location/read-all-geo-location");
            }}
          />
        )}
      </Route>
      <Route path="/geo_location/read-all-geo-location/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/geo_location/read-all-geo-location");
            }}
          />
        )}
      </Route>
      <Route path="/geo_location/read-all-geo-location/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/geo_location/read-all-geo-location");
            }}
          />
        )}
      </Route>
      <Route path="/geo_location/read-all-geo-location/:id/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/geo_location/read-all-geo-location");
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
