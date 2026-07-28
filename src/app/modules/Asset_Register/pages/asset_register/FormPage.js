import React from "react";
import { useDispatch } from "react-redux";
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
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/asset_register/read-all-asset-register/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/asset_register/read-all-asset-register/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/asset_register/read-all-asset-register/${id}/${status}/delete`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/asset_register/read-all-asset-register/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/asset_register/read-all-asset-register/${id}/read`);
    },
    openReadAssetHistoryDialog: (id, isUserRead) => {
      history.push(`/asset_register/read-all-asset-register/${id}/assethistory`);
    },
    
    openReadAssetAssessmentDialog: (id, isUserRead) => {
      history.push(`/asset_register/read-all-asset-register/${id}/sssetassessment`);
    },
  };
  return (

    
    <FormUIProvider FormUIEvents={FormUIEvents}>
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
      <Route path="/asset_register/read-all-asset-register/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>
      <Route path="/asset_register/read-all-asset-register/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>
      <Route path="/asset_register/read-all-asset-register/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>


          <Route path="/asset_register/read-all-asset-register/:id/assethistory">
        {({ history, match }) => (
          <AssetHistoryTable
            show={match != null}
            
            Id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/asset_register/read-all-asset-register");
            }}
          />
        )}
      </Route>
    
          <Route path="/asset_register/read-all-asset-register/:id/sssetassessment">
        {({ history, match }) => (
          <AssetAssessmentTable
            show={match != null}
            
            Id={match && match.params.id}
            status={match && match.params.status}
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
