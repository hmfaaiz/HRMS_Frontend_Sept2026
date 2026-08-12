import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/asset_disposal/read-all-asset-disposal/new");
    },

    openEditFormDialog: (id) => {
      // history.push(`/asset_disposal/read-all-asset-disposal/${id}/edit`);
      history.push({
        pathname: "/asset_disposal/read-all-asset-disposal/edit",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {
      // history.push(`/asset_disposal/read-all-asset-disposal/${id}/${status}/delete`);
      history.push({
        pathname: "/asset_disposal/read-all-asset-disposal/revert",
        state: {
          id,
          status,
        },
      });
    },

    openUnassignFormDialog: (id, status) => {
      // history.push(`/asset_disposal/read-all-asset-disposal/${id}/${status}/unassign`);
      history.push({
        pathname: "/asset_disposal/read-all-asset-disposal/unassign",
        state: {
          id,
          status,
        },
      });
    },

    openActiveFormDialog: (id) => {
      history.push(`/asset_disposal/read-all-asset-disposal/${id}/active`);
    },

    openReadFormDialog: (id, isUserRead) => {
      // history.push(`/asset_disposal/read-all-asset-disposal/${id}/read`);
      history.push({
        pathname: "/asset_disposal/read-all-asset-disposal/read",
        state: {
          id,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* NEW */}
      <Route exact path="/asset_disposal/read-all-asset-disposal/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/asset_disposal/read-all-asset-disposal");
            }}
          />
        )}
      </Route>

      {/* EDIT */}
      <Route path="/asset_disposal/read-all-asset-disposal/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            onHide={() => {
              history.push("/asset_disposal/read-all-asset-disposal");
            }}
          />
        )}
      </Route>

      {/* READ */}
      <Route path="/asset_disposal/read-all-asset-disposal/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            userForRead={true}
            onHide={() => {
              history.push("/asset_disposal/read-all-asset-disposal");
            }}
          />
        )}
      </Route>

      {/* revert */}
      <Route path="/asset_disposal/read-all-asset-disposal/revert">
        {({ history, match }) => (
          <FormDynamicDialogModal
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            // status={match && match.params.status}
            status={location.state?.status}
            title="Revert Record"
            message="Are you sure you want to revert this record?"
            confirmButtonText="Revert Record"
            onHide={() =>
              history.push("/asset_disposal/read-all-asset-disposal")
            }
            actionName="deleteAssetRegister"
          />
        )}
      </Route>

      {/* UNASSIGN */}
      <Route path="/asset_disposal/read-all-asset-disposal/unassign">
        {({ history, match }) => (
          <FormDynamicDialogModal
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            // status={match && match.params.status}
            status={location.state?.status}
            title="Unassign Asset"
            message="Are you sure you want to unassign this asset?"
            confirmButtonText="Unassign"
            onHide={() =>
              history.push("/asset_disposal/read-all-asset-disposal")
            }
            actionName="unassignAssetRegister"
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