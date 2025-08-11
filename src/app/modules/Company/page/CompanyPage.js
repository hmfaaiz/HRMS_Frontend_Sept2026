import React from "react";
import { FormUIProvider } from "./FormUIContext";
import { Route } from "react-router-dom";
import { CompanyEditDialog } from "./form/company-edit-dialog/CompanyEditDialog";
import { useSelector, shallowEqual } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../utils/common-modules/ModuleName";
import { ToastContainer } from "react-toastify";
import { CompanyDeleteDialog } from "./form/company-delete-dailog/CompanyDeleteDailog";
import { CompanyTable } from "./form/form-table/FormTable";
import FormFilter from "../page/form/form-filter/FormFilter";
import TCard from "../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
export function CompanyPage({ history }) {
  const componentEvents = {
    newButtonClick: () => {
      history.push("/company/read-all-company/new");
    },
    openEditDialog: (id) => {
      history.push(`/company/read-all-company/${id}/edit`);
    },
    openDeleteDialog: (id, status) => {
      history.push(`/company/read-all-company/${id}/delete`);
    },
    openReadDialog: (id) => {
      history.push(`/company/read-all-company/${id}/read`);
    },
  };
  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess.company,
    }),
    shallowEqual
  );
  const accessPage = userAccess.find(
    (item) => item.componentName === "CreateCompany"
  );

  return (
    <FormUIProvider FormUIEvents={componentEvents}>
      <Route path="/company/read-all-company/new">
        {({ history, match }) => (
          <CompanyEditDialog
            show={match != null}
            onHide={() => {
              history.push("/company/read-all-company");
            }}
          />
        )}
      </Route>
      <Route path="/company/read-all-company/:id/edit">
        {({ history, match }) => (
          <CompanyEditDialog
            show={match != null}
            onHide={() => {
              history.push("/company/read-all-company");
            }}
          />
        )}
      </Route>
      <Route path="/company/read-all-company/:id/read">
        {({ history, match }) => (
          <CompanyEditDialog
            isUserForRead={true}
            show={match != null}
            onHide={() => {
              history.push("/company/read-all-company");
            }}
          />
        )}
      </Route>
      <Route path="/company/read-all-company/:id/delete">
        {({ history, match }) => (
          <CompanyDeleteDialog
            show={match != null}
            onHide={() => {
              history.push("/company/read-all-company");
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
                Add Company
              </button>
            )}
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <CompanyTable />
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
                
                <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add 
                </button>
              </>
            )}
            {/* </CardHeaderToolbar> */}
          </div>
        </div>
          <CompanyTable />
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
