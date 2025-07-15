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
import { ApprovalFormTable } from "../form-table/ApprovalTable";
import { WorkflowTable } from "../form-table/WorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";

export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { listLoading, user } = useSelector(
    (state) => ({
      listLoading: state?.attendance_workflow_status?.listLoading,
      user: state?.auth?.user,
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
      action.fetchAttendanceApprovalApplication(
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
        {/* <FormApproval /> */}
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
    </Card>
  );
};
