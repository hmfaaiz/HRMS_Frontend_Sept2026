import React, { useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";
import { FormFilter } from "../form-filter/FormFilter";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { user, reimbursement } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      reimbursement: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => ({
    queryParams: FormUIContext?.queryParams,
    setQueryParams: FormUIContext?.setQueryParams,
    workflowId: FormUIContext?.workflowId,
    setWorkflowId: FormUIContext?.setWorkflowId,
  }));

  useEffect(() => {
    dispatch(
      actions.fetchReimbursementApprovalApplication(
        formUIProps?.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [formUIProps?.queryParams]);

  const menuOptions = [
    {
      name: "Request",
      link: "/reimbursement_claim_request/read-all-reimbursement-claim-request",
      isShow: reimbursement?.find(
        (el) => el?.componentName === "ReadAllReimbursementClaimRequest" && el?.isResourceShow
      ),
    },
    {
       name: "Workflow Status",
       link: "/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status",
       isShow: reimbursement?.find(
       (el) =>
        el?.componentName === "ReadAllReimbursementClaimWorkflowStatus" &&
        el?.isResourceShow
      ),
     },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
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

      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>

        {/* <FormFilter queryParams={formUIProps?.queryParams} /> */}

        <div className="px-3 py-2 rounded-lg bg-white">
          <FormApproval />
          <ApprovalFormTable />
        </div>

        {formUIProps.workflowId && (
          <WorkflowTable
            show={formUIProps.workflowId !== null}
            onHide={() => formUIProps.setWorkflowId(null)}
          />
        )}
      </div>
    </div>
  );
};