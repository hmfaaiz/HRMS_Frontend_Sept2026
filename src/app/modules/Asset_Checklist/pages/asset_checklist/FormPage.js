import React from "react";
import { useDispatch } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";

import { FormCard } from "./form-card/FormCard";
import { } from "../../_redux/redux-Actions";



export function FormPage({ history }) {
  console.log("history111111")

  const dispatch = useDispatch();
  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/asset_checklist/read-all-asset-checklist/new");
    },
    openEditFormDialog: (
      assetCategoryId,
      assetRegisterId,
      dateOfInspection
    ) => {
      history.push({
        pathname: "/asset_checklist/read-all-asset-checklist/edit",
        state: {
          assetCategoryId,
          assetRegisterId,
          dateOfInspection,
        },
      });
    },

    openActiveFormDialog: (id) => {
      history.push(`/asset_checklist/read-all-asset-checklist/${id}/active`);
    },
    openReadFormDialog: (assetCategoryId,
      assetRegisterId,
      dateOfInspection, isUserRead) => {

      history.push({
        pathname: `/asset_checklist/read-all-asset-checklist/read`,
        state: {
          assetCategoryId,
          assetRegisterId,
          dateOfInspection,
          isUserRead,
        },
      });
    },

 openDeleteFormDialog: (
  assetCategoryId,
  assetRegisterId,
  dateOfInspection
) => {
  history.push({
    pathname: "/asset_checklist/read-all-asset-checklist/delete",
    state: {
      assetCategoryId,
      assetRegisterId,
      dateOfInspection,
    },
  });
},
  };
  return (


    <FormUIProvider FormUIEvents={FormUIEvents}>
      <Route exact path="/asset_checklist/read-all-asset-checklist/new">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            clearForm={true}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
            }}
          />
        )}
      </Route>
      {/* <Route path="/asset_checklist/read-all-asset-checklist/:id/edit">
        {({ history, match }) => (
          <FormEditDialog
            show={match != null}
            id={match && match.params.id}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
            }}
          />
        )}
      </Route> */}


      <Route path="/asset_checklist/read-all-asset-checklist/edit">
        {({ history, location, match }) => (
          <FormEditDialog
            show={match != null}
            clearForm={false}
            assetCategoryId={location.state?.assetCategoryId}
            assetRegisterId={location.state?.assetRegisterId}
            dateOfInspection={location.state?.dateOfInspection}
            dataForRead={false}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
            }}
          />
        )}
      </Route>
      <Route path="/asset_checklist/read-all-asset-checklist/read">
        {({ history, location, match }) => (
          <FormEditDialog
            show={match != null}
            clearForm={false}
            assetCategoryId={location.state?.assetCategoryId}
            assetRegisterId={location.state?.assetRegisterId}
            dateOfInspection={location.state?.dateOfInspection}
            dataForRead={true}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
            }}
          />
        )}
      </Route>
      {/* <Route path="/asset_checklist/read-all-asset-checklist/:id/:status/delete">
        {({ history, match }) => (
          <FormDeleteDialog
            show={match != null}
            id={match && match.params.id}
            status={match && match.params.status}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
            }}
          />
        )}
      </Route> */}

      <Route path="/asset_checklist/read-all-asset-checklist/delete">
        {({ history, location, match }) => (
          <FormDeleteDialog
            show={match != null}
            assetCategoryId={location?.state?.assetCategoryId}
            assetRegisterId={location?.state?.assetRegisterId}
            dateOfInspection={location?.state?.dateOfInspection}
            onHide={() => {
              history.push("/asset_checklist/read-all-asset-checklist");
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
