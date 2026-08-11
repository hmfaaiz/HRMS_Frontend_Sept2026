import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "./form-delete-dialog/FormDeleteDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";
import { useSelector, shallowEqual } from "react-redux";
import { Switch } from "react-router-dom";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { FormCard } from "./form-card/FormCard";

export function FormPage({ history }) {

  // shared state for applicant detail toggle
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);

  // Get values passed through history.push state
  const location = useLocation();

  const FormUIEvents = {
    newFormButtonClick: () => {
      history.push("/employee_transfer/read-all-employee-transfer/new");
    },

    openEditFormDialog: (id) => {

      // history.push(`/employee_transfer/read-all-employee-transfer/${id}/edit`);
      history.push({
        pathname: "/employee_transfer/read-all-employee-transfer/edit",
        state: {
          id,
        },
      });
    },

    openDeleteFormDialog: (id, status) => {

      // history.push(`/employee_transfer/read-all-employee-transfer/${id}/${status}/delete`);
      history.push({
        pathname: "/employee_transfer/read-all-employee-transfer/delete",
        state: {
          id,
          status,
        },
      });
    },

    openActiveFormDialog: (id) => {

      // history.push(`/employee_transfer/read-all-employee-transfer/${id}/active`);
      history.push({
        pathname: "/employee_transfer/read-all-employee-transfer/active",
        state: {
          id,
        },
      });
    },

    openReadFormDialog: (id, isUserRead) => {

      // history.push(`/employee_transfer/read-all-employee-transfer/${id}/read`);
      history.push({
        pathname: "/employee_transfer/read-all-employee-transfer/read",
        state: {
          id,
          isUserRead,
        },
      });
    },
  };

  const { userAccess } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess?.employee_transfer || [],
    };
  }, shallowEqual);

  const accessUser = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeTransfer"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadEmployeeTransfer"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateEmployeeTransfer";
  });

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeTransfer"
  );

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>

      {/* <FormCard /> */}

      <TCard name={CurrentModuleName()}>

        {/* pass toggle state + handler into FormCard ── */}
        <FormCard
          showApplicantDetails={showApplicantDetails}
          onApplicantDetailsChange={setShowApplicantDetails}
        />

      </TCard>

      <Switch>

        {/* NEW */}
        {accessUser && (
          <Route exact path="/employee_transfer/read-all-employee-transfer/new">
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                status="new"
                onHide={() =>
                  history.push(
                    "/employee_transfer/read-all-employee-transfer"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* EDIT */}
        {isAccessForEdit && (
          <Route
            // path="/employee_transfer/read-all-employee-transfer/:id/edit"
            path="/employee_transfer/read-all-employee-transfer/edit"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                status="edit"
                onHide={() =>
                  history.push(
                    "/employee_transfer/read-all-employee-transfer"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* READ */}
        {isAccessForView && (
          <Route
            // path="/employee_transfer/read-all-employee-transfer/:id/read"
            path="/employee_transfer/read-all-employee-transfer/read"
          >
            {({ history, match }) => (
              <FormEditDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                status="read"
                dataForRead={true}
                onHide={() =>
                  history.push(
                    "/employee_transfer/read-all-employee-transfer"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* DELETE */}
        {isAccessForDelete && (
          <Route
            // path="/employee_transfer/read-all-employee-transfer/:id/:status/delete"
            path="/employee_transfer/read-all-employee-transfer/delete"
          >
            {({ history, match }) => (
              <FormDeleteDialog
                show={match != null}
                // id={match?.params?.id}
                id={location.state?.id}
                // status={match?.params?.status}
                status={location.state?.status}
                onHide={() =>
                  history.push(
                    "/employee_transfer/read-all-employee-transfer"
                  )
                }
              />
            )}
          </Route>
        )}

        {/* ACTIVE */}
        <Route
          // path="/employee_transfer/read-all-employee-transfer/:id/active"
          path="/employee_transfer/read-all-employee-transfer/active"
        >
          {({ history, match }) => (
            <FormDynamicDialogModal
              show={match != null}
              // id={match?.params?.id}
              id={location.state?.id}
              onHide={() =>
                history.push(
                  "/employee_transfer/read-all-employee-transfer"
                )
              }
            />
          )}
        </Route>

      </Switch>

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

