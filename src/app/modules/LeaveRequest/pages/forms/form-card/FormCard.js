import React, { useEffect, useMemo, useState } from "react";
import { LeaveApplicationTable } from "../form-table/LeaveApplicationTable";
import { useFormUIContext } from "../FormUIContext";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { EmployeeSelect } from "../form-edit-dialog/EmployeeSelect";
import {
  fetchAllActiveEmployees,
  fetchAllLeaveType,
  getActiveFiscalYear,
} from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/formActions";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { LeaveBalanceTable } from "../form-table/LeaveBalanceTable";
import "../../../../../utils/common-modules/form.css";
import { useLocation } from "react-router-dom";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";

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
    isPolicyExists,
    payrollData,
    employeeList,
    leave,
  } = useSelector(
    (state) => ({
      dashboard: state.dashboard,
      entities: state.leave_request.entities,
      leave: state?.auth?.userAccess["Leave"],
      payrollData: state.leave_request?.payrollData,
      empAuthorityList: state?.leave_request?.empAuthorityList,
      isPolicyExists: state?.leave_request?.isPolicyExists,
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
      dispatch(actions.getSandwichPolicy(formUIProps.employeeId.value));
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Approval",
                link: "/leave-approval/read-all-leave-approval",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link: "/leave-workflow-status/read-all-leave-workflow-status",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Leave Calendar",
                link: "/leave_calendar_team/read-leave-calendar",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadLeaveCalendar" &&
                    el?.isResourceShow
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
                link: "/leave-approval/read-all-leave-approval",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveApproval" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Workflow Status",
                link: "/leave-workflow-status/read-all-leave-workflow-status",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveWorkflowStatus" &&
                    el?.isResourceShow
                ),
              },
              {
                name: "Leave Calendar",
                link: "/leave_calendar_team/read-leave-calendar",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadLeaveCalendar" &&
                    el?.isResourceShow
                ),
              },
            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeSelect
          setId={formUIProps?.setId}
          setemployeeId={formUIProps?.setemployeeId}
          employeeId={formUIProps?.employeeId?.value}
          currentLevel={formUIProps?.currentLevel}
          initUser={formUIProps?.initUser}
          setCurrentLevel={formUIProps?.setCurrentLevel}
        />

        <LeaveBalanceTable />

        <FormEditDialog
          id={formUIProps.id}
          currentLevel={formUIProps?.currentLevel}
          employeeId={formUIProps?.employeeId?.value}
          empAuthorityList={empAuthorityList}
          isPolicyExists={isPolicyExists}
          initUser={{
            ...formUIProps?.initUser,
            from: dateFromAtt !== null ? new Date(dateFromAtt) : "",
            to: dateFromAtt !== null ? new Date(dateFromAtt) : "",
            days: dateFromAtt !== null ? 1 : "",
          }}
        />

        <LeaveApplicationTable />
        <WorkflowAuthortiesTable />
      </div>
    </div>
  );
}
