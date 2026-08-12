import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import {} from "../../_redux/redux-Actions";
import { AssetHistoryTable } from "./form-table/AssetHistoryTable";
import { AssetAssessmentTable } from "./form-table/AssetAssessmentTable";

export function FormPage({ history }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/asset_register/read-all-asset-register/new");
    },

    openEditFormDialog: (id) => {
      // history.push(`/asset_register/read-all-asset-register/${id}/edit`);
      history.push({
        pathname: "/asset_register/read-all-asset-register/edit",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {
      // history.push(`/asset_register/read-all-asset-register/${id}/${status}/delete`);
      history.push({
        pathname: "/asset_register/read-all-asset-register/delete",
        state: {
          id,
          status,
        },
      });
    },

    openActiveFormDialog: (id) => {
      history.push(`/asset_register/read-all-asset-register/${id}/active`);
    },

    openReadFormDialog: (id, isUserRead) => {
      // history.push(`/asset_register/read-all-asset-register/${id}/read`);
      history.push({
        pathname: "/asset_register/read-all-asset-register/read",
        state: {
          id,
        },
      });
    },

    openReadAssetHistoryDialog: (id, isUserRead) => {
      // history.push(`/asset_register/read-all-asset-register/${id}/assethistory`);
      history.push({
        pathname: "/asset_register/read-all-asset-register/assethistory",
        state: {
          id,
        },
      });
    },

    openReadAssetAssessmentDialog: (id, isUserRead) => {
      // history.push(`/asset_register/read-all-asset-register/${id}/sssetassessment`);
      history.push({
        pathname: "/asset_register/read-all-asset-register/sssetassessment",
        state: {
          id,
        },
      });
    },
  };

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* NEW */}
      <Route exact path="/asset_register/read-all-asset-register/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>

      {/* EDIT */}
      <Route path="/asset_register/read-all-asset-register/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>

      {/* READ */}
      <Route path="/asset_register/read-all-asset-register/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            // id={match && match.params.id}
            id={location.state?.id}
            userForRead={true}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>

      {/* DELETE */}
      <Route path="/asset_register/read-all-asset-register/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            // id={match && match.params.id}
            // status={match && match.params.status}
            id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>

      {/* ASSET HISTORY */}
      <Route path="/asset_register/read-all-asset-register/assethistory">
        {({ history, match }) => (
          <AssetHistoryTable
            show={match != null}
            // Id={match && match.params.id}
            // status={match && match.params.status}
            Id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>

      {/* ASSET ASSESSMENT */}
      <Route path="/asset_register/read-all-asset-register/sssetassessment">
        {({ history, match }) => (
          <AssetAssessmentTable
            show={match != null}
            // Id={match && match.params.id}
            // status={match && match.params.status}
            Id={location.state?.id}
            status={location.state?.status}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
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