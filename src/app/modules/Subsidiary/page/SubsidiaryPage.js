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
import { SubsidiaryEditDialog } from "./form/subsidiary-edit-dialog/SubsidiaryEditDialog";
import { SubsidiaryDeleteDialog } from "./form/subsidiary-delete-dailog/SubsidiaryDeleteDailog";
import { SubsidiaryTable } from "./form/form-table/FormTable";
import TCard from "../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
export function SubsidiaryPage({ history }) {
  const componentEvents = {
    newButtonClick: () => {
      history.push("/subsidiary/read-all-subsidiary/new");
    },
    openEditDialog: (id) => {
      history.push(`/subsidiary/read-all-subsidiary/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/subsidiary/read-all-subsidiary/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/subsidiary/read-all-subsidiary/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.subsidiary,
    }),
    shallowEqual
  );
  const accessPage = userAccess.find(
    (item) => item.componentName === "CreateSubsidiary"
  );

  return (
    <FormUIProvider FormUIEvents={componentEvents}>
      <Route path="/subsidiary/read-all-subsidiary/new">
        {({ history, match }) => (
          <SubsidiaryEditDialog
            show={match != null}
            onHide={() => {
              history.push("/subsidiary/read-all-subsidiary");
            }}
          />
        )}
      </Route>
      <Route path="/subsidiary/read-all-subsidiary/:id/edit">
        {({ history, match }) => (
          <SubsidiaryEditDialog
            show={match != null}
            onHide={() => {
              history.push("/subsidiary/read-all-subsidiary");
            }}
          />
        )}
      </Route>
      <Route path="/subsidiary/read-all-subsidiary/:id/read">
        {({ history, match }) => (
          <SubsidiaryEditDialog
            isUserForRead={true}
            show={match != null}
            onHide={() => {
              history.push("/subsidiary/read-all-subsidiary");
            }}
          />
        )}
      </Route>
      <Route path="/subsidiary/read-all-subsidiary/:id/delete">
        {({ history, match }) => (
          <SubsidiaryDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/subsidiary/read-all-subsidiary");
            }}
          />
        )}
      </Route>
      {/* <Card>
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
                Add Subsidiary
              </button>
            )}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <SubsidiaryTable />
        </CardBody>
      </Card> */}
      <TCard name={CurrentModuleName()}>
        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFilter />
          <div className="flex items-center gap-2">
            {/* <CardHeaderToolbar> */}
            {accessPage && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={componentEvents.newButtonClick}
                >
                >
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              </>
            )}
            {/* </CardHeaderToolbar> */}
          </div>
        </div>
        <SubsidiaryTable />
      </TCard>
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
