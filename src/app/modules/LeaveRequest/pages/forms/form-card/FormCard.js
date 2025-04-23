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
import { getStorage } from "../../../../../../_metronic/_helpers";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";

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
      currentLevel: FormUIContext.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
    };
  }, [FormUIContext]);

  //Get data from states
  const { dashboard, entities, empAuthorityList } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      entities: state.leave_request.entities,
      empAuthorityList: state?.leave_request?.empAuthorityList,
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
    if (formUIProps.employeeId) {
      dispatch(actions.fetchLeaveBalances(formUIProps.employeeId));
      dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId));
      dispatch(fetchAllLeaveType("allLeaveTypes", formUIProps.employeeId));
      dispatch(actions.getPayrollMonth(formUIProps.employeeId));
    }
  }, [dispatch, formUIProps.employeeId, entities]);

  return (
    <Card>
      {/* Card Starts */}

      <CardBody>
        <CardHeader title={CurrentModuleName()}></CardHeader>

        <div className="justify-content-between align-items-center gap-3 m-4">
          <div className="pt-5">
            {/* EmployeeSelect Starts */}
            <EmployeeSelect
              setId={formUIProps.setId}
              setemployeeId={formUIProps.setemployeeId}
              employeeId={formUIProps.employeeId}
              currentLevel={formUIProps.currentLevel}
              setCurrentLevel={formUIProps.setCurrentLevel}
            />
            {/* EmployeeSelect Ends */}

            <br />
            <hr />
          </div>

          {/* EmployeeProfile Starts */}
          <EmployeeProfile employeeId={formUIProps.employeeId} />
          {/* EmployeeProfile Ends */}
          <br />
          <hr />

          {/* FormEditDialog Starts */}
          <FormEditDialog
            id={formUIProps.id}
            currentLevel={formUIProps.currentLevel}
            employeeId={formUIProps.employeeId}
            empAuthorityList={empAuthorityList}
          />
          {/* FormEditDialog Ends */}
        </div>
        <br />

        {/* LeaveApplicationTable Starts */}
        <LeaveApplicationTable />
        {/* LeaveApplicationTable Ends */}
        {/* 
        <br />
        <hr /> */}

        {/* PendingLeaveTable Starts */}
        {/* <PendingLeaveTable /> */}
        {/* PendingLeaveTable Ends */}

        <br />
        <hr />

        {/* LeaveBalanceTable Starts */}
        <LeaveBalanceTable />

        <br />
        <hr />

        <WorkflowAuthortiesTable />
        {/* LeaveBalanceTable Ends */}
      </CardBody>

      {/* Card Ends */}
    </Card>
  );
}
