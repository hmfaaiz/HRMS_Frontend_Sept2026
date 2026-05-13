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
  const {
    user,
    requisition_job_vacancy,
    requisition_job_approval,
  } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      requisition_job_vacancy:
        state?.auth?.userAccess?.["Job Requisition Vacancy"],
      requisition_job_approval: state?.auth?.userAccess?.Recruitment,
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
  });
  useEffect(() => {
    dispatch(
      action.fetchAllApprovalApplication(
        formUIProps?.queryParams,
        user?.employeeIdMapping,
      ),
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
                link:
                  "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                isShow: requisition_job_vacancy?.find(
                  (el) =>
                    el?.componentName === "ReadAllRequisitionJobVacancy" &&
                    el?.isResourceShow &&
                    el?.portalType == 2,
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/job_requestion_workflow/read-all-job-requestion-workflow",
                isShow: requisition_job_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllJobRequestionWorkflow" &&
                    el?.isResourceShow &&
                    el?.portalType == 2,
                ),
              },
              // {
              //   name: "Workflow Status",
              //   link: "/loan-workflow-status/read-all-loan-workflow-status",
              //   isShow: loan?.find(
              //     (el) =>
              //       el?.componentName === "ReadAllLoanWorkflowStatus" &&
              //       el?.isResourceShow,
              //   ),
              // },
              // {
              //   name: "Payslip",
              //   link: "/payslip/read-payslip",
              //   isShow: loan?.find(
              //     (el) =>
              //       el?.componentName === "ReadPayslip" && el?.isResourceShow,
              //   ),
              // },
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
                link:
                  "/requisition_job_vacancy/read-all-requisition-job-vacancy",
                isShow: requisition_job_vacancy?.find(
                  (el) =>
                    el?.componentName === "ReadAllRequisitionJobVacancy" &&
                    el?.isResourceShow &&
                    el?.portalType == 2,
                ),
              },
              {
                name: "Workflow Status",
                link:
                  "/job_requestion_workflow/read-all-job-requestion-workflow",
                isShow: requisition_job_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllJobRequestionWorkflow" &&
                    el?.isResourceShow &&
                    el?.portalType == 2,
                ),
              },
              // {
              //   name: "Workflow Status",
              //   link: "/loan-workflow-status/read-all-loan-workflow-status",
              //   isShow: loan?.find(
              //     (el) =>
              //       el?.componentName === "ReadAllLoanWorkflowStatus" &&
              //       el?.isResourceShow,
              //   ),
              // },
              // {
              //   name: "Payslip",
              //   link: "/payslip/read-payslip",
              //   isShow: loan?.find(
              //     (el) =>
              //       el?.componentName === "ReadPayslip" && el?.isResourceShow,
              //   ),
              // },
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
