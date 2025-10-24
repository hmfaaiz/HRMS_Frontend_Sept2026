import React from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";
import { FormTable } from "../form-table/FormTable";
import { useSelector, shallowEqual } from "react-redux";

export function FormCard() {
  const { resignation, rejectedRecord } = useSelector(
    (state) => ({
      resignation: state?.auth?.userAccess["Resignation"],
      rejectedRecord: state.resignation_request?.rejectedRecord,
    }),
    shallowEqual
  );
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Approval",
                link: "/resignation_approval/read-all-resignation-approval",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignationApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/resignation_workflow_status/read-all-resignation-workflow-status",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignationWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
            ]}
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
            menuOptions={[
              {
                name: "Approval",
                link: "/resignation_approval/read-all-resignation-approval",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignationApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/resignation_workflow_status/read-all-resignation-workflow-status",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignationWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <FormEditDialog />
        </div>
        {rejectedRecord?.length > 0 && (
          <div className="px-3 py-2 rounded-lg bg-white">
            <FormTable />
          </div>
        )}
        <div className="px-3 py-2 rounded-lg bg-white">
          <WorkflowAuthortiesTable />
        </div>
      </div>
    </div>
  );
}
