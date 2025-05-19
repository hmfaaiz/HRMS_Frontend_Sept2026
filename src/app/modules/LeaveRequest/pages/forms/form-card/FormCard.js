import React, { useEffect, useMemo, useState } from "react";
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
  getActiveFiscalYear,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/formActions";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { LeaveBalanceTable } from "../form-table/LeaveBalanceTable";
import { PendingLeaveTable } from "../form-table/PendingLeaveTable";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useLocation } from "react-router-dom";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const location = useLocation();
  const [dateFromAtt, setDateFromAtt] = useState(null);

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
      initUser: FormUIContext.initUser,
    };
  }, [FormUIContext]);

  //Get data from states
  const {
    dashboard,
    entities,
    empAuthorityList,
    payrollData,
    employeeList,
  } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      entities: state.leave_request.entities,
      payrollData: state.leave_request?.payrollData,
      empAuthorityList: state?.leave_request?.empAuthorityList,
      employeeList: state?.dashboard?.employeeList,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (location?.state) {
      let state = location?.state;
      formUIProps.setCurrentLevel(state?.employeeId?.level);
      formUIProps.setemployeeId(state?.employeeId);
      setDateFromAtt(state?.leaveDate);
    }
    if (
      !formUIProps?.employeeId?.value &&
      employeeList?.length > 0 &&
      !location?.state
    ) {
      formUIProps.setemployeeId(employeeList[0]);
    }
  }, [employeeList, formUIProps?.employeeId, location]);

  //Get data from server and set on state whenever employee Id is updated
  useEffect(() => {
    if (formUIProps.employeeId?.value) {
      dispatch(
        actions.fetchLeaveApplication(
          formUIProps.queryParamsLeaveApp,
          formUIProps.employeeId.value
        )
      );

      if (!dashboard.allEmployees?.length) {
        dispatch(fetchAllActiveEmployees());
      }
    }
  }, [formUIProps.employeeId?.value, formUIProps.queryParamsLeaveApp]);

  //Update Leave Balances whenever employee Id is changed or leave application table is updated
  //Also update dropdown of leave type when employee is selected
  useEffect(() => {
    if (formUIProps.employeeId?.value) {
      dispatch(actions.fetchLeaveBalances(formUIProps.employeeId.value));
      dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId.value));
      dispatch(
        fetchAllLeaveType("allLeaveTypes", formUIProps.employeeId.value)
      );
      dispatch(actions.getPayrollMonth(formUIProps.employeeId.value));
    }
  }, [formUIProps.employeeId?.value]);
  useEffect(() => {
    if (payrollData) {
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [payrollData]);
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
              employeeId={formUIProps.employeeId?.value}
              currentLevel={formUIProps.currentLevel}
              initUser={formUIProps?.initUser}
              setCurrentLevel={formUIProps.setCurrentLevel}
            />
            {/* EmployeeSelect Ends */}

            <br />
            <hr />
          </div>

          {/* EmployeeProfile Starts */}
          <EmployeeProfile employeeId={formUIProps.employeeId.value} />
          {/* EmployeeProfile Ends */}
          <br />
          <hr />

          {/* FormEditDialog Starts */}
          <FormEditDialog
            id={formUIProps.id}
            currentLevel={formUIProps.currentLevel}
            employeeId={formUIProps.employeeId.value}
            empAuthorityList={empAuthorityList}
            initUser={{
              ...formUIProps?.initUser,
              from: dateFromAtt !== null ? new Date(dateFromAtt) : "",
              to: dateFromAtt !== null ? new Date(dateFromAtt) : "",
            }}
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
