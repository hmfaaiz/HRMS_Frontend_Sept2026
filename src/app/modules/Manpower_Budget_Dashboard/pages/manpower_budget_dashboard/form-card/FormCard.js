import React, { useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { fetchAllBudgetYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";
import { FormData } from "../form-data/FormData";

export function FormCard() {
  const dispatch = useDispatch();
  const {
    department_wise_budget_approval,
    user,
  } = useSelector((state) => {
    return {
      department_wise_budget_approval:
        state?.auth?.userAccess["Manpower Budget"],
      user: state?.auth?.user,
    };
  }, shallowEqual);

  useEffect(() => {
    if (!user?.EmployeeMapping?.subsidiaryId) return;

    dispatch(
      fetchAllBudgetYearDataBySubsidiaryId(user?.EmployeeMapping?.subsidiaryId),
    );
  }, [user?.EmployeeMapping?.subsidiaryId]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
            menuOptions={[
              {
                name: "Department Budget Request",
                link:
                  "/manpower_budget_dashboard/read-manpower-budget-dashboard",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllPortalDepartmentWiseBudget" &&
                    el?.portalType == 2 &&
                    el?.isResourceShow,
                ),
              },
              {
                name: "Approval",
                link:
                  "/department_wise_budget_approval/read-all-budget-approval",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllBudgetApproval" &&
                    el?.portalType == 2 &&
                    el?.isResourceShow,
                ),
              },

              {
                name: "Workflow Status",
                link:
                  "/budget_workflow_status_portal/read-all-budget-workflow-status-portal",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllBudgetWorkflowStatusPortal" &&
                    el?.portalType == 2 &&
                    el?.isResourceShow,
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
                name: "Department Budget Request",
                link:
                  "/manpower_budget_dashboard/read-manpower-budget-dashboard",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadManpowerBudgetDashboard" &&
                    el?.portalType == 2 &&
                    el?.isResourceShow,
                ),
              },
              {
                name: "Approval",
                link:
                  "/department_wise_budget_approval/read-all-budget-approval",
                isShow: department_wise_budget_approval?.find(
                  (el) => el?.componentName === "ReadAllBudgetApproval",
                ),
              },

              {
                name: "Workflow Status",
                link:
                  "/budget_workflow_status_portal/read-all-budget-workflow-status-portal",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllBudgetWorkflowStatusPortal" &&
                    el?.isResourceShow,
                ),
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <FormData />
        </div>
      </div>
    </div>
  );
}
