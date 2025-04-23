import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { FormFilter } from "../form-filter/FormFilter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../redux/formAction";
import { LeaveApprovalFormTable } from "../form-table/LeaveApprovalTable";
import { LeaveBalanceTable } from "../form-table/LeaveBalanceTable";
import { LeaveWorkflowTable } from "../form-table/LeaveWorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";
import { set } from "date-fns";
export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { listLoading, user } = useSelector(
    (state) => ({
      listLoading: state?.leave_approval?.listLoading,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      leaveBalanceId: FormUIContext?.leaveBalanceId,
      leaveWorkflowId: FormUIContext?.leaveWorkflowId,
      setLeaveBalanceId: FormUIContext?.setLeaveBalanceId,
      setLeaveWorkflowId: FormUIContext?.setLeaveWorkflowId,
    };
  });
  useEffect(() => {
    dispatch(
      action.fetchLeaveApprovalApplication(
        formUIProps?.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [formUIProps?.queryParams]);

  return (
    <Card>
      <CardHeader title={CurrentModuleName()}></CardHeader>
      <FormFilter loading={listLoading} queryParams={formUIProps.queryParams} />
      <div
        style={{
          backgroundColor: "rgb(235 243 255)",
          marginTop: "15px",
          padding: "20px",
          borderRadius: "5px",
          border: "2px solid #adceff",
        }}
      >
        <FormApproval />
        <LeaveApprovalFormTable />
      </div>
      {formUIProps.leaveBalanceId && (
        <LeaveBalanceTable
          onHide={() => {
            formUIProps.setLeaveBalanceId(null);
          }}
          show={formUIProps.leaveBalanceId !== null}
        />
      )}
      {formUIProps.leaveWorkflowId && (
        <LeaveWorkflowTable
          onHide={() => {
            formUIProps.setLeaveWorkflowId(null);
          }}
          show={formUIProps.leaveWorkflowId !== null}
        />
      )}
    </Card>
  );
};
