import React, { useEffect, useMemo } from "react";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../../FormUIContext";
import * as action from "../../../redux/formAction";
import { LeaveApprovalFormTable } from "../form-table/LeaveApprovalTable";
import { LeaveWorkflowTable } from "../form-table/LeaveWorkflowTable";
import { FormApproval } from "../form-approval/FormApproval";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
export const FormCard = () => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { user, leave } = useSelector(
    (state) => ({
      user: state?.auth?.user,
      leave: state?.auth?.userAccess["Leave"],
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/leave-request/read-all-leave-request",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveRequest" &&
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
      </div> */}
      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Request",
                link: "/leave-request/read-all-leave-request",
                isShow: leave?.find(
                  (el) =>
                    el?.componentName === "ReadAllLeaveRequest" &&
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
        <div className="px-3 py-2 rounded-lg bg-white">
          <FormApproval />
          <LeaveApprovalFormTable />
        </div>
        {/* {formUIProps.leaveBalanceId && (
            <LeaveBalanceTable
              onHide={() => {
                formUIProps.setLeaveBalanceId(null);
              }}
              show={formUIProps.leaveBalanceId !== null}
            />
          )} */}
        {formUIProps.leaveWorkflowId && formUIProps.leaveBalanceId && (
          <LeaveWorkflowTable
            onHide={() => {
              formUIProps.setLeaveWorkflowId(null);
              formUIProps.setLeaveBalanceId(null);
            }}
            show={
              formUIProps.leaveWorkflowId !== null &&
              formUIProps.leaveBalanceId !== null
            }
          />
        )}
      </div>
    </div>
  );
};
