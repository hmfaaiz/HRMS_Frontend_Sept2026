import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as action from "../../../_redux/redux-Actions";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const {
    listLoading,
    requisition_job_approval,
    requisition_job_vacancy,
  } = useSelector(
    (state) => ({
      listLoading: state?.job_requestion_workflow_status?.listLoading,
      requisition_job_approval: state?.auth?.userAccess?.Recruitment,
      requisition_job_vacancy:
        state?.auth?.userAccess?.["Job Requisition Vacancy"],
    }),
    shallowEqual,
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      workflowId: FormUIContext?.workflowId,
      setWorkflowId: FormUIContext?.setWorkflowId,
    };
  }, [FormUIContext]);

  const menuOptions = [
    {
      name: "Request",
      link: "/requisition_job_vacancy/read-all-requisition-job-vacancy",
      isShow: requisition_job_vacancy?.find(
        (el) =>
          el?.componentName === "ReadAllRequisitionJobVacancy" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
    },
    {
      name: "Approval",
      link: "/job_requestion_approval/read-all-job-requestion-approval",
      isShow: requisition_job_approval?.find(
        (el) =>
          el?.componentName == "ReadAllJobRequestionApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Sidebar */}
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div> */}

      {/* Main Content */}
      {/* <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4"> */}
      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
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
