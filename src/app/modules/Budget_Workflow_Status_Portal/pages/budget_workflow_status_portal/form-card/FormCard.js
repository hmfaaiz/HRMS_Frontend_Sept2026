import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { ApprovalFormTable } from "../form-table/ApprovalFormTable";
import { WorkflowTable } from "../form-table/FormWorkflowTable";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { listLoading, user, access } = useSelector(
    (state) => ({
      listLoading: state?.budget_workflow_status_portal?.listLoading,
      user:        state?.auth?.user,
      access:      state?.auth?.userAccess?.["Budget"],
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => ({
    queryParams:    FormUIContext?.queryParams,
    setQueryParams: FormUIContext?.setQueryParams,
    workflowId:     FormUIContext?.workflowId,
    setWorkflowId:  FormUIContext?.setWorkflowId,
  }), [FormUIContext]);

  useEffect(() => {
  if (!user?.employeeIdMapping) return;
  dispatch(
    actions.fetchBudgetApprovalApplication(
      formUIProps?.queryParams,
      user?.employeeIdMapping
    )
  );
}, [formUIProps?.queryParams, dispatch, user?.employeeIdMapping]);

  const menuOptions = [
    {
      name: "Request",
      link: "/portal_department_wise_budget/read-all-portal-department-wise-budget",
      isShow: access?.find(
        (el) =>
          el?.componentName === "ReadAllPortalDepartmentWiseBudget" && el?.isResourceShow
      ),
    },
    {
      name: "Approval",
      link: "/department_wise_budget_approval/read-all-budget-approval",
      isShow: access?.find(
        (el) =>
          el?.componentName === "ReadAllBudgetApproval" &&
          el?.isResourceShow
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

      {/* Sidebar */}
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>

      {/* Main Content */}
      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <FormFilter
            loading={listLoading}
            queryParams={formUIProps.queryParams}
          />
          <ApprovalFormTable />
        </div>

        {formUIProps.workflowId && (
          <WorkflowTable
            onHide={() => formUIProps.setWorkflowId(null)}
            show={formUIProps.workflowId !== null}
          />
        )}
      </div>
    </div>
  );
};