import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const FormUIEvents = {
    newButtonClick: () => {
      history.push("/onetime_allowance/read-all-onetime-allowance/new");
    },
    openEditDialog: (id) => {
      history.push(`/onetime_allowance/read-all-onetime-allowance/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(
        `/onetime_allowance/read-all-onetime-allowance/${id}/delete`
      );
    },
    openReadDialog: (id) => {
      history.push(`/onetime_allowance/read-all-onetime-allowance/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.onetime_allowance,
    }),
    shallowEqual
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateOnetimeAllowance"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteOnetimeAllowance"
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateOnetimeAllowance"
  );
  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadOnetimeAllowance"
  );
  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormCard />
      {accessUser && (
        <Route
          path="/onetime_allowance/read-all-onetime-allowance/new"
          render={({ match, history }) => (
            <FormEditDialog
              status="new"
              onHide={() =>
                history.push("/onetime_allowance/read-all-onetime-allowance")
              }
            />
          )}
        />
      )}

      {isAccessForEdit && (
        <Route
          path="/onetime_allowance/read-all-onetime-allowance/:id/edit"
          render={({ match, history }) => (
            <FormEditDialog
              id={match.params.id}
              status="edit"
              onHide={() =>
                history.push("/onetime_allowance/read-all-onetime-allowance")
              }
            />
          )}
        />
      )}

      {isAccessForRead && (
        <Route
          path="/onetime_allowance/read-all-onetime-allowance/:id/read"
          render={({ match, history }) => (
            <FormEditDialog
              id={match.params.id}
              status="read"
              userForRead={true}
              onHide={() =>
                history.push("/onetime_allowance/read-all-onetime-allowance")
              }
            />
          )}
        />
      )}

      {isAccessForDelete && (
        <Route path="/onetime_allowance/read-all-onetime-allowance/:id/delete">
          {({ history, match }) => (
            <BankDeleteDialog
              show={match != null}
              id={match && match.params.id}
              onHide={() => {
                history.push("/onetime_allowance/read-all-onetime-allowance");
              }}
            />
          )}
        </Route>
      )}

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
