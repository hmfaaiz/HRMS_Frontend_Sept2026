import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { LeaveApplicationTable } from "../form-table/LeaveApplicationTable";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import {
  fetchAllActiveEmployees,
  fetchAllLeaveType,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/formActions";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { LeaveBalanceTable } from "../form-table/LeaveBalanceTable";
import { PendingLeaveTable } from "../form-table/PendingLeaveTable";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { LeaveApplicationDetailTable } from "../form-table/LeaveApplicationDetailTable";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  //Get EmployeeId functions and values from Context in FormUIContext.js file
  const formUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      queryParamsLeaveApp: FormUIContext.queryParamsLeaveApp,
      id: FormUIContext.id,
      setId: FormUIContext.setId,
      leaveId: FormUIContext?.leaveId,
      setLeaveId: FormUIContext.setLeaveId,
      panelMode:FormUIContext.panelMode,
      setPanelMode:FormUIContext.setPanelMode,

    };
  }, [FormUIContext]);

  //Get data from states
  const { dashboard, entities } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      entities: state.leave_application.entities,
    }),
    shallowEqual
  );

  //Get data from server and set on state whenever employee Id is updated
  useEffect(() => {
    dispatch(
      actions.fetchLeaveApplication(
        formUIProps.queryParamsLeaveApp,
        formUIProps.employeeId
      )
    );

    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch, formUIProps.employeeId, formUIProps.queryParamsLeaveApp]);

  //Update Leave Balances whenever employee Id is changed or leave application table is updated
  //Also update dropdown of leave type when employee is selected
  useEffect(() => {
    dispatch(actions.fetchLeaveBalances(formUIProps.employeeId));
    dispatch(fetchAllLeaveType("allLeaveTypes", formUIProps.employeeId));
    dispatch(actions.getPayrollMonth(formUIProps.employeeId));
  }, [dispatch, formUIProps.employeeId, entities]);

  const SubmitLeaveDetail = async (data, onHide) => {
    await dispatch(actions?.updateLeaveDetail(data, onHide));
    await dispatch(
      actions.fetchLeaveApplication(
        formUIProps.queryParamsLeaveApp,
        formUIProps.employeeId
      )
    );
  };

  return (
    <Card>
      {/* Card Starts */}
  <CardHeader title={CurrentModuleName()}></CardHeader>
      <CardBody>
      

        <div className="justify-content-between align-items-center gap-3 ">
          <div className="">
            {/* EmployeeSelect Starts */}
            <EmployeeSelect
              setId={formUIProps.setId}
              setemployeeId={formUIProps.setemployeeId} setPanelMode={formUIProps.setPanelMode} panelMode={formUIProps.panelMode}
            />
            {/* EmployeeSelect Ends */}

            <br />
          
          </div>

          {/* EmployeeProfile Starts */}
          <EmployeeProfile employeeId={formUIProps.employeeId} panelMode={formUIProps.panelMode} />
          {/* EmployeeProfile Ends */}
      

          {/* FormEditDialog Starts */}
          <FormEditDialog
            id={formUIProps.id}
            employeeId={formUIProps.employeeId}
          />
          {/* FormEditDialog Ends */}
        </div>
        <br />

        {/* LeaveApplicationTable Starts */}
        <LeaveApplicationTable />
        {/* LeaveApplicationTable Ends */}
        <LeaveApplicationDetailTable
          show={formUIProps?.leaveId !== null}
          onHide={() => formUIProps.setLeaveId(null)}
          leaveId={formUIProps?.leaveId}
          handleSubmit={SubmitLeaveDetail}
        />

        <br />
        <hr />

        {/* PendingLeaveTable Starts */}
        <PendingLeaveTable />
        {/* PendingLeaveTable Ends */}

        <br />
        <hr />

        {/* LeaveBalanceTable Starts */}
        <LeaveBalanceTable />
        {/* LeaveBalanceTable Ends */}
      </CardBody>

      {/* Card Ends */}
    </Card>
  );
}
