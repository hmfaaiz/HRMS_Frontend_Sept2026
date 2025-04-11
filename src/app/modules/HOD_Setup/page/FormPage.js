import React from "react";
import { FormUIProvider } from "./FormUIContext";
import { Route } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../utils/common-modules/ModuleName";
import { ToastContainer } from "react-toastify";

import FormFilter from "./form/form-filter/FormFilter";
import { FormTable } from "./form/form-table/FormTable";
import { EditDialog } from "./form/edit-dialog/EditDialog";
import { DeleteDialog } from "./form/delete-dailog/DeleteDailog";
export function FormPage({ history }) {
  const componentEvents = {
    newButtonClick: () => {
      history.push("/hod_setup/read-all-hod-setup/new");
    },
    openEditDialog: (id) => {
      history.push(`/hod_setup/read-all-hod-setup/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/hod_setup/read-all-hod-setup/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/hod_setup/read-all-hod-setup/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.hod_setup,
    }),
    shallowEqual
  );
  const accessPage = userAccess.find(
    (item) => item.componentName === "CreateHodSetup"
  );

  return (
    <FormUIProvider FormUIEvents={componentEvents}>
      <Route path="/hod_setup/read-all-hod-setup/new">
        {({ history, match }) => (
          <EditDialog
            show={match != null}
            onHide={() => {
              history.push("/hod_setup/read-all-hod-setup");
            }}
          />
        )}
      </Route>
      <Route path="/hod_setup/read-all-hod-setup/:id/edit">
        {({ history, match }) => (
          <EditDialog
            show={match != null}
            onHide={() => {
              history.push("/hod_setup/read-all-hod-setup");
            }}
          />
        )}
      </Route>
      <Route path="/hod_setup/read-all-hod-setup/:id/read">
        {({ history, match }) => (
          <EditDialog
            isUserForRead={true}
            show={match != null}
            onHide={() => {
              history.push("/hod_setup/read-all-hod-setup");
            }}
          />
        )}
      </Route>
      <Route path="/hod_setup/read-all-hod-setup/:id/delete">
        {({ history, match }) => (
          <DeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/hod_setup/read-all-hod-setup");
            }}
          />
        )}
      </Route>
      <Card>
        <CardHeader title={CurrentModuleName()}>
          <CardHeaderToolbar>
            <div className="pr-5">
              <FormFilter />
            </div>
            {accessPage && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={componentEvents.newButtonClick}
              >
                Add HOD
              </button>
            )}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <FormTable />
        </CardBody>
      </Card>
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
