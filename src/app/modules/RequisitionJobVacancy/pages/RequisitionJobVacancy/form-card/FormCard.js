import React, { useMemo } from "react";
import { Switch, Route } from "react-router-dom";

import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormDeleteDialog } from "../form-delete-dialog/FormDeleteDialog";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowTable";

export function FormCard() {
  const FormUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  const { userAccess , empAuthorityList } = useSelector((state) => {
    return {
      userAccess: state.auth.userAccess.requisition_job_vacancy,
     empAuthorityList : state?.requisition_job_vacancy?.empAuthorityList || [],
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateRequisitionJobVacancy",
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadRequisitionJobVacancy",
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateRequisitionJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteRequisitionJobVacancy",
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
            menuOptions={[]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
            menuOptions={[]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-2 rounded-lg bg-white">
          <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
            <FormFIlter />
            <div className="flex items-center gap-2">
              {accessUser && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={FormUIProps.newFormButtonClick}
                >
                  <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                  Add
                </button>
              )}
            </div>
          </div>

          <FormTable />
          <br></br>
        </div>
        <Switch>
          {/* NEW */}
          {accessUser && (
            <Route
              exact
              path="/requisition_job_vacancy/read-all-requisition-job-vacancy/new"
            >
              {({ history, match }) => (
                <FormEditDialog
                  show={match != null}
                  status="new"
                  onHide={() =>
                    history.push(
                      "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                    )
                  }
                />
              )}
            </Route>
          )}

          {/* EDIT */}
          {isAccessForEdit && (
            <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/edit">
              {({ history, match }) => (
                <FormEditDialog
                  show={match != null}
                  id={match?.params?.id}
                  status="edit"
                  onHide={() =>
                    history.push(
                      "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                    )
                  }
                />
              )}
            </Route>
          )}
          {/* READ */}
          {isAccessForView && (
            <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/read">
              {({ history, match }) => (
                <FormEditDialog
                  show={match != null}
                  id={match?.params?.id}
                  status="read"
                  dataForRead={true}
                  onHide={() =>
                    history.push(
                      "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                    )
                  }
                />
              )}
            </Route>
          )}

          {/* DELETE */}
          {isAccessForDelete && (
            <Route path="/requisition_job_vacancy/read-all-requisition-job-vacancy/:id/:status/delete">
              {({ history, match }) => (
                <FormDeleteDialog
                  show={match != null}
                  id={match?.params?.id}
                  status={match?.params?.status}
                  onHide={() =>
                    history.push(
                      "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                    )
                  }
                />
              )}
            </Route>
          )}
        </Switch>

        <WorkflowAuthortiesTable empAuthorityList={empAuthorityList} />
      </div>
    </div>
  );
}
