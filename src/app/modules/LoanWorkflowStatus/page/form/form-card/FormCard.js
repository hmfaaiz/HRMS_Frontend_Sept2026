import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../redux/formAction";
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { listLoading, user, loan } = useSelector(
    (state) => ({
      listLoading: state?.loan_workflow_status?.listLoading,
      user: state?.auth?.user,
      loan: state?.auth?.userAccess["Payroll"],
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
      action.fetchLoanApprovalApplication(
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
                link: "/loan_request/read-all-loan-request",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanRequest" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Approval",
                link: "/loan_approval/read-all-loan-approval",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Payslip",
                link: "/payslip/read-payslip",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadPayslip" && el?.isResourceShow
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
                link: "/loan_request/read-all-loan-request",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanRequest" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Approval",
                link: "/loan_approval/read-all-loan-approval",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Payslip",
                link: "/payslip/read-payslip",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadPayslip" && el?.isResourceShow
                ),
              },
            ]}
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
