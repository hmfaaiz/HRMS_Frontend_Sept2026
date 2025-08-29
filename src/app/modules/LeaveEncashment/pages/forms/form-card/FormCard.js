import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { LeaveEncashmentTable } from "../form-table/LeaveEncashmentTable";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import {
  fetchAllActiveEmployees,
  fetchAllFiscalYearData,
  fetchAllLeaveType,
  fetchEncashmentLeaveType,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/formActions";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { LeaveBalanceTable } from "../form-table/LeaveBalanceTable";
import { PendingLeaveTable } from "../form-table/PendingLeaveEncTable";
import "../../../../../utils/common-modules/form.css";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  //Get EmployeeId functions and values from Context in FormUIContext.js file
  const formUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      yearId: FormUIContext.yearId,
      setyearId: FormUIContext.setyearId,
      queryParamsLeaveEnc: FormUIContext.queryParamsLeaveEnc,
      id: FormUIContext.id,
      setId: FormUIContext.setId,
      panelMode: FormUIContext.panelMode,
      setPanelMode: FormUIContext.setPanelMode,
    };
  }, [FormUIContext]);

  //Get data from states
  const { dashboard, entities } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      entities: state.leave_encashment.entities,
    }),
    shallowEqual
  );

  //Get data from server and set on state whenever employee Id is updated
  useEffect(() => {
    dispatch(
      actions.fetchLeaveEncashment(
        formUIProps.queryParamsLeaveEnc,
        formUIProps.employeeId,
        formUIProps.yearId
      )
    );

    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [
    dispatch,
    formUIProps.employeeId,
    formUIProps.yearId,
    formUIProps.queryParamsLeaveEnc,
  ]);

  //Update Leave Balances whenever employee Id is changed or leave encashment table is updated
  //Also update dropdown of leave type when employee is selected
  useEffect(() => {
    dispatch(
      fetchEncashmentLeaveType(
        "allLeaveTypes",
        formUIProps.employeeId,
        formUIProps.yearId
      )
    );
  }, [dispatch, formUIProps.employeeId, formUIProps.yearId, entities]);

  useEffect(() => {
    dispatch(actions.fetchLeaveBalances(formUIProps.employeeId));
    dispatch(actions.getPayrollMonth(formUIProps.employeeId));
    dispatch(fetchAllFiscalYearData("allFiscalYears", formUIProps.employeeId));
  }, [formUIProps.employeeId]);

  return (
    // <>
    //   <Card>
    //     {/* Card Starts */}
    //     <CardHeader title={CurrentModuleName()}></CardHeader>

    //     <CardBody>
    //       {/* <CardHeader title={CurrentModuleName()} >
    //     </CardHeader> */}

    //       <div className="justify-content-between align-items-center gap-3 m-4">
    //         <div className="">
    //           {/* EmployeeSelect Starts */}
    //           <EmployeeSelect
    //             setId={formUIProps.setId}
    //             setemployeeId={formUIProps.setemployeeId}
    //             setyearId={formUIProps.setyearId}
    //             setPanelMode={formUIProps.setPanelMode}
    //             panelMode={formUIProps.panelMode}
    //           />
    //           {/* EmployeeSelect Ends */}

    //           <br />
    //         </div>

    //         {/* EmployeeProfile Starts */}
    //         <EmployeeProfile
    //           employeeId={formUIProps.employeeId}
    //           panelMode={formUIProps.panelMode}
    //         />
    //         {/* EmployeeProfile Ends */}

    //         {/* FormEditDialog Starts */}
    //         <FormEditDialog
    //           id={formUIProps.id}
    //           employeeId={formUIProps.employeeId}
    //           yearId={formUIProps.yearId}
    //         />
    //         {/* FormEditDialog Ends */}
    //       </div>
    //       <br />

    //       {/* LeaveEncashmentTable Starts */}
    //       <LeaveEncashmentTable />
    //       {/* LeaveEncashmentTable Ends */}

    //       <br />
    //       <hr />

    //       {/* This is Commented for now because we don't have scenario of pending yet  (start)*/}
    //       {/* PendingLeaveTable Starts */}
    //       {/* <PendingLeaveTable /> */}
    //       {/* PendingLeaveTable Ends */}

    //       {/* <br />
    //     <hr /> */}
    //       {/* This is Commented for now because we don't have scenario of pending yet (End)*/}

    //       {/* LeaveBalanceTable Starts */}
    //       <LeaveBalanceTable />
    //       {/* LeaveBalanceTable Ends */}
    //     </CardBody>

    //     {/* Card Ends */}
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <div className="">
        <EmployeeSelect
          setId={formUIProps.setId}
          setemployeeId={formUIProps.setemployeeId}
          setyearId={formUIProps.setyearId}
          setPanelMode={formUIProps.setPanelMode}
          panelMode={formUIProps.panelMode}
        />
        <div className="flex items-center gap-2">
          {/* EmployeeProfile Starts */}
          <EmployeeProfile
            employeeId={formUIProps.employeeId}
            panelMode={formUIProps.panelMode}
          />
          {/* EmployeeProfile Ends */}
        </div>
        {/* FormEditDialog Starts */}
        <FormEditDialog
          id={formUIProps.id}
          employeeId={formUIProps.employeeId}
          yearId={formUIProps.yearId}
        />
        {/* FormEditDialog Ends */}
        <hr />
        {/* LeaveEncashmentTable Starts */}
        <LeaveEncashmentTable />
        {/* LeaveEncashmentTable Ends */}
        <hr />
        {/* LeaveBalanceTable Starts */}
        <LeaveBalanceTable />
        {/* LeaveBalanceTable Ends */}
      </div>
    </TCard>
    // </>
  );
}
