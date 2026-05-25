import React, { useMemo, useEffect } from "react";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";

import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch } from "react-redux";
import { getAllLoanConfigDetail } from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import { WorkflowTable } from "../form-table/WorkflowTable"; // ADD import

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const { employeeList, payrollData, empAuthorityList, loan } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      payrollData: state?.loan_request?.payrollData,
      empAuthorityList: state?.loan_request?.empAuthorityList,
      loan: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual
  );

  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParams: FormUIContext.queryParams,
      id: FormUIContext.ids,
      workflowId: FormUIContext.workflowId,       
      setWorkflowId: FormUIContext.setWorkflowId,
    };
  }, [FormUIContext]);

  useEffect(() => {
    if (!FormUIProps?.employeeId?.value && employeeList?.length > 0) {
      FormUIProps.setemployeeId(employeeList[0]);
    }
  }, [employeeList, FormUIProps?.employeeId]);

  //Get data from server and set on state whenever employee Id is updated
  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(getAllLoanConfigDetail({ Id: FormUIProps.employeeId?.value }));
      dispatch(
        actions.fetchEmployeeLoanRequest({
          ...FormUIProps.queryParams,
          employeeId: FormUIProps.employeeId.value,
        })
      );
    }
  }, [FormUIProps.employeeId?.value, FormUIProps.queryParams]);

  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(actions.getEmployeeAuthorities(FormUIProps.employeeId.value));
      dispatch(actions.getPayrollMonth(FormUIProps.employeeId.value));
    }
  }, [FormUIProps.employeeId?.value]);
  useEffect(() => {
    if (payrollData) {
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [payrollData]);

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
                link: "/loan_approval/read-all-loan-approval",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link: "/loan-workflow-status/read-all-loan-workflow-status",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanWorkflowStatus" &&
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
                name: "Approval",
                link: "/loan_approval/read-all-loan-approval",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link: "/loan-workflow-status/read-all-loan-workflow-status",
                isShow: loan?.find(
                  (el) =>
                    el?.componentName === "ReadAllLoanWorkflowStatus" &&
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
        <EmployeeSelect />

        <FormEditDialog
          id={FormUIProps.id}
          employeeId={FormUIProps.employeeId?.value}
        />
        <FormTable />
        <WorkflowAuthortiesTable />
      </div>
      {FormUIProps.workflowId && (
  <WorkflowTable
    show={FormUIProps.workflowId !== null}
    onHide={() => FormUIProps.setWorkflowId(null)}
  />
)}
    </div>
  );
}
