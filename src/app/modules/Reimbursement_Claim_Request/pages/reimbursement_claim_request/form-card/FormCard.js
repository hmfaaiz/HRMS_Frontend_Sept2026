import React, { useMemo, useEffect } from "react";
import { useFormUIContext } from "../FormUIContext";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { FormTable } from "../form-table/FormTable";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";
import {
  fetchAllFormsMenu,
  fetchAllPayrollMonthYearList,
} from "../../../../../../_metronic/redux/dashboardActions";
import { WorkflowTable } from "../form-table/WorkflowTable"; 

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const { employeeList, loan } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
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

  // ── Set default employee ─────
  useEffect(() => {
    if (!FormUIProps?.employeeId?.value && employeeList?.length > 0) {
      FormUIProps.setemployeeId(employeeList[0]);
    }
  }, [employeeList, FormUIProps?.employeeId]);

  // ── Fetch claims list ─────
  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(
        actions.fetchReimbursementClaim({
          ...FormUIProps.queryParams,
          employeeId: FormUIProps.employeeId.value,
        })
      );
    }
  }, [FormUIProps.employeeId?.value, FormUIProps.queryParams]);

  // ── Fetch authorities + payroll month + config policies ────
  useEffect(() => {
    if (FormUIProps.employeeId?.value) {
      dispatch(actions.getEmployeeAuthorities(FormUIProps.employeeId.value));
      dispatch(actions.getPayrollMonth(FormUIProps.employeeId.value));
      dispatch(
        actions.fetchReimbursementConfigPolicies({
          Id: FormUIProps.employeeId.value,
        })
      );
      dispatch(
        fetchAllPayrollMonthYearList(
          {
            subsidiaryId: null,
            employeeId: FormUIProps.employeeId.value,
          },
          "allPayrollMonthYearList"
        )
      );
    }
  }, [FormUIProps.employeeId?.value]);

  // ── Fetch reimbursement types dropdown ─────
  useEffect(() => {
    dispatch(fetchAllFormsMenu(202, "allReimbursementTypeList"));
  }, []);

  const menuOptions = [
    {
      name: "Approval",
      link: "/reimbursement_claim_approval/read-all-reimbursement-claim-approval",
      isShow: loan?.find(
        (el) =>
          el?.componentName === "ReadAllReimbursementClaimApproval" &&
          el?.isResourceShow
      ),
    },
    {
      name: "Workflow Status",
      link: "/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status",
      isShow: loan?.find(
      (el) =>
        el?.componentName === "ReadAllReimbursementClaimWorkflowStatus" &&
        el?.isResourceShow
       ),
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
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