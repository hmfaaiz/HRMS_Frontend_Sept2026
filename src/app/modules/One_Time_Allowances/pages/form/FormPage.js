import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {
  const location = useLocation();

  const FormUIEvents = {
    newButtonClick: () => {
      history.push("/onetime_allowance/read-all-onetime-allowance/new");
    },

    openEditDialog: (id) => {
      // OLD URL
      // history.push(`/onetime_allowance/read-all-onetime-allowance/${id}/edit`);

      // NEW URL - ID hidden from URL
      history.push({
        pathname: "/onetime_allowance/read-all-onetime-allowance/edit",
        state: {
          id,
        },
      });
    },

    openDeleteDialog: (id, status) => {
      // OLD URL
      // history.push(
      //   `/onetime_allowance/read-all-onetime-allowance/${id}/delete`
      // );

      // NEW URL - ID and status hidden from URL
      history.push({
        pathname: "/onetime_allowance/read-all-onetime-allowance/delete",
        state: {
          id,
          status,
        },
      });
    },

    openReadDialog: (id) => {
      // OLD URL
      // history.push(`/onetime_allowance/read-all-onetime-allowance/${id}/read`);

      // NEW URL - ID hidden from URL
      history.push({
        pathname: "/onetime_allowance/read-all-onetime-allowance/read",
        state: {
          id,
        },
      });
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

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateOnetimeAllowance"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadOnetimeAllowance"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
      <FormCard />

      {/* NEW */}
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

      {/* EDIT */}

      {/* OLD URL */}
      {/*
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
      */}

      {/* NEW URL - ID from location.state */}
      {isAccessForEdit && (
        <Route
          path="/onetime_allowance/read-all-onetime-allowance/edit"
          render={({ match, history }) => (
            <FormEditDialog
              show={match != null}
              id={location.state?.id}
              status="edit"
              onHide={() =>
                history.push("/onetime_allowance/read-all-onetime-allowance")
              }
            />
          )}
        />
      )}

      {/* READ */}

      {/* OLD URL */}
      {/*
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
      */}

      {/* NEW URL - ID from location.state */}
      {isAccessForRead && (
        <Route
          path="/onetime_allowance/read-all-onetime-allowance/read"
          render={({ match, history }) => (
            <FormEditDialog
              show={match != null}
              id={location.state?.id}
              status="read"
              userForRead={true}
              onHide={() =>
                history.push("/onetime_allowance/read-all-onetime-allowance")
              }
            />
          )}
        />
      )}

      {/* DELETE */}

      {/* OLD URL */}
      {/*
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
      */}

      {/* NEW URL - ID and status from location.state */}
      {isAccessForDelete && (
        <Route path="/onetime_allowance/read-all-onetime-allowance/delete">
          {({ history, match }) => (
            <BankDeleteDialog
              show={match != null}
              id={location.state?.id}
              status={location.state?.status}
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