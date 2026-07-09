import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";



export function FormPage({ history }) {


  const dispatch = useDispatch();
  const FormUIEvents = {

    newFormButtonClick: () => {
      history.push("/asset_assignment/read-all-asset-assignment/new");
    },
    openEditFormDialog: (id) => {
      history.push(`/asset_assignment/read-all-asset-assignment/${id}/edit`);
    },
    openDeleteFormDialog: (id, status) => {
      history.push(`/asset_assignment/read-all-asset-assignment/${id}/${status}/delete`);
    },
    openUnassignFormDialog: (id, status) => {
      history.push(`/asset_assignment/read-all-asset-assignment/${id}/${status}/unassign`);
    },
    openActiveFormDialog: (id) => {
      history.push(`/asset_assignment/read-all-asset-assignment/${id}/active`);
    },
    openReadFormDialog: (id, isUserRead) => {
      history.push(`/asset_assignment/read-all-asset-assignment/${id}/read`);
    },
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/asset_assignment/read-all-asset-assignment/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            onHide={() => {
              history.push("/asset_assignment/read-all-asset-assignment");
            }}
          />
        )}
      </Route>
      <Route path="/asset_assignment/read-all-asset-assignment/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/asset_assignment/read-all-asset-assignment");
            }}
          />
        )}
      </Route>
      <Route path="/asset_assignment/read-all-asset-assignment/:id/read">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            userForRead={true}
            onHide={() => {
              history.push("/asset_assignment/read-all-asset-assignment");
            }}
          />
        )}
      </Route>
      <Route path="/asset_assignment/read-all-asset-assignment/:id/:status/delete">
        {({ history, match }) => (
      
          <FormDynamicDialogModal
            show={match != null}
            id={match && match.params.id}

            status={match && match.params.status}
            title="Delete Record"
            message="Are you sure you want to delete this record?"
            confirmButtonText="Delete Record"
            onHide={() => history.push("/asset_assignment/read-all-asset-assignment")}
            actionName="deleteAssetRegister"
          />
        )}
      </Route>


 <Route path="/asset_assignment/read-all-asset-assignment/:id/:status/unassign">
        {({ history, match }) => (
      
          <FormDynamicDialogModal
            show={match != null}
            id={match && match.params.id}

            status={match && match.params.status}
            title="Unassign Asset"
            message="Are you sure you want to unassign this asset?"
            confirmButtonText="Unassign"
            onHide={() => history.push("/asset_assignment/read-all-asset-assignment")}
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
