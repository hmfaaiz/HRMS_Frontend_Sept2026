import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../redux/formAction";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { user, resignation } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      resignation: state?.auth?.userAccess["Resignation"],
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      workflowId: FormUIContext?.workflowId,
      setWorkflowId: FormUIContext?.setWorkflowId,
    };
  });
  useEffect(() => {
    dispatch(
      action.fetchResignationApprovalApplication(
        formUIProps?.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [formUIProps?.queryParams]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/employee_resignation/read-all-resignation",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignation" &&
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
                name: "Request",
                link: "/employee_resignation/read-all-resignation",
                isShow: resignation?.find(
                  (el) =>
                    el?.componentName === "ReadAllResignation" &&
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
          <FormApproval />
          <ApprovalFormTable />
        </div>
        {formUIProps.workflowId && (
          <WorkflowTable
            onHide={() => {
              formUIProps.setWorkflowId(null);
            }}
            show={formUIProps.workflowId !== null}
          />
        )}
      </div>
    </div>
  );
};
