import React from "react";
import { useSelector, shallowEqual } from "react-redux";

export const PendingRequestSelf = ({ moduleRights, setAttModalData, data }) => {
  const { leave, payroll, attendance, resignation, roster,budget } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
      attendance: state?.auth?.userAccess["Attendance"],
      roster: state?.auth?.userAccess["Attendance Management"],
      payroll: state?.auth?.userAccess["Payroll"],
      resignation: state?.auth?.userAccess["Resignation"],
      budget: state?.auth?.userAccess["Budget"],
    }),
    shallowEqual,
  );


  const PENDINGAPPROVALWORKFLOWLIST = [
    {
      name: "Leave",
      count: data?.leaveApproval || 0,
      isApproval: leave?.find(
        (el) =>
          el?.componentName == "ReadAllLeaveApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/leave-approval/read-all-leave-approval",
      isWorkflow: leave?.find(
        (el) =>
          el?.componentName == "ReadAllLeaveWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/attendance-workflow-status/read-all-attendance-workflow-status",
      isModuleAllow: moduleRights?.find((el) => el?.value == 2)?.allow,
    },
    {
      name: "Attendance",
      count: data?.attApproval || 0,
      isApproval: attendance?.find(
        (el) =>
          el?.componentName == "ReadAllAttendanceApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/attendance_approval/read-all-attendance-approval",
      isWorkflow: attendance?.find(
        (el) =>
          el?.componentName == "ReadAllAttendanceWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/attendance-workflow-status/read-all-attendance-workflow-status",
      isModuleAllow: moduleRights?.find((el) => el?.value == 3)?.allow,
    },
    {
      name: "Roster",
      count: data?.rosterApproval || 0,
      isApproval: roster?.find(
        (el) =>
          el?.componentName == "ReadAllAttendanceRosterApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl:
        "/attendance_roster_approval/read-all-attendance-roster-approval",
      isWorkflow: roster?.find(
        (el) =>
          el?.componentName == "ReadAllAttendanceRosterWorkflowStatusPortal" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/attendance_roster_workflow_status_portal/read-all-attendance-roster-workflow-status-portal",
      isModuleAllow: moduleRights?.find((el) => el?.value == 3)?.allow,
    },
    {
      name: "Loan",
      count: data?.loanApproval || 0,
      isApproval: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllLoanApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/loan_approval/read-all-loan-approval",
      isWorkflow: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllLoanWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl: "/loan-workflow-status/read-all-loan-workflow-status",
      isModuleAllow: moduleRights?.find((el) => el?.value == 4)?.allow,
    },
    {
      name: "Travel",
      count: data?.tadaApproval || 0,
      isApproval: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllTravelRequestApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/travel_request_approval/read-all-travel-request-approval",
      isWorkflow: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllTravelRequestWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/travel_request_workflow_status/read-all-travel-request-workflow-status",
      isModuleAllow: moduleRights?.find((el) => el?.value == 4)?.allow,
    },
    {
      name: "Claim",
      count: data?.reimbApproval || 0,
      isApproval: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllReimbursementClaimApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl:
        "/reimbursement_claim_approval/read-all-reimbursement-claim-approval",
      isWorkflow: payroll?.find(
        (el) =>
          el?.componentName == "ReadAllReimbursementClaimWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status",
      isModuleAllow: moduleRights?.find((el) => el?.value == 4)?.allow,
    },
    {
      name: "Resignation",
      count: data?.resignApproval || 0,
      isApproval: resignation?.find(
        (el) =>
          el?.componentName == "ReadAllResignationApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/resignation_approval/read-all-resignation-approval",
      isWorkflow: resignation?.find(
        (el) =>
          el?.componentName == "ReadAllResignationWorkflowStatus" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      workflowUrl:
        "/resignation_workflow_status/read-all-resignation-workflow-status",
      isModuleAllow: moduleRights?.find((e) => e?.value == "separation")?.allow,
    },
    {
      name: "Budget",
      count: data?.BudgetApproval || 0,
      isApproval: budget?.find(
        (el) =>
          el?.componentName == "ReadAllBudgetApproval" &&
          el?.isResourceShow &&
          el?.portalType == 2,
      ),
      approvalUrl: "/department_wise_budget_approval/read-all-budget-approval",
      // isWorkflow: budget?.find(
      //   (el) =>
      //     el?.componentName == "" &&
      //     el?.isResourceShow &&
      //     el?.portalType == 2,
      // ),
      // workflowUrl:
      //   "/",
      isModuleAllow: moduleRights?.find((el) => el?.value ==8)?.allow,
    },
  ];

  const filteredCards = PENDINGAPPROVALWORKFLOWLIST?.filter(
    (el) => el?.isModuleAllow && (el?.isApproval || el?.isWorkflow),
  );

  return (
    <>
      <div className="p-3 rounded-lg bg-white w-full flex max-h-64 flex-col overflow-y-auto justify-between">
        <h6 className="font-bold mb-0 text-primary my-2">Pending Requests</h6>

        <div className="flex gap-1.5 w-full mb-2 overflow-x-auto scrollbar-fancy">
          <div className="flex gap-1.5 w-full pb-3">
            {/* Team Member Card - Sticky on the left */}
            {moduleRights?.find((el) => el?.value == 3)?.allow ? (
              <div className="sticky left-0 z-10 flex-shrink-0 bg-white px-3 sm:w-72">
                <TeamMemberCard
                  team={data?.reportingEmployee}
                  setAttModalData={setAttModalData}
                />
              </div>
            ) : null}

            {/* Scrollable Workflow Cards */}
            <div className="flex gap-1.5 min-w-min">
              {filteredCards.map((el) => (
                <div key={el.name} className="flex-shrink-0 w-48 sm:w-64">
                  <WorkflowApprovalCard
                    name={el.name}
                    approvalUrl={el.approvalUrl}
                    isApproval={el.isApproval}
                    count={el.count}
                    isWorkflow={el.isWorkflow}
                    workflowUrl={el.workflowUrl}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TeamMemberCard = ({ team, setAttModalData }) => {
  return (
    <div className="bg-tprimary font-weight-bolder max-sm:min-w-48 w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between h-full">
      <div className="flex justify-between items-center">
        <span className="text-white font-semibold text-base sm:text-lg flex items-center truncate line-clamp-1">
          Team Members
        </span>
        <span className="text-white text-base sm:text-xl font-semibold flex items-center truncate line-clamp-1">
          {team?.length}
        </span>
      </div>

      <div className="flex gap-x-2 md:gap-x-5 items-center">
        <span
          onClick={() =>
            setAttModalData(
              team?.filter((e) => {
                // Check if attendance exists and has at least one record
                const attendance = e?.t_attendances?.[0];
                return (
                  attendance &&
                  (attendance?.timeIn !== "" || attendance?.timeOut !== "")
                );
              }),
            )
          }
          className="text-white rounded-full cursor-pointer bg-tgreen px-2 py-1 md:py-2 md:px-4 text-xs md:text-sm font-normal text-center line-clamp-1"
        >
          Present{" "}
          {team?.filter((e) => {
            const attendance = e?.t_attendances?.[0];
            return (
              attendance &&
              (attendance?.timeIn !== "" || attendance?.timeOut !== "")
            );
          })?.length || 0}
        </span>

        <span
          onClick={() =>
            setAttModalData(
              team?.filter((e) => {
                const attendance = e?.t_attendances?.[0];
                // Absent if: no attendance record OR both timeIn and timeOut are empty
                return (
                  !attendance ||
                  (attendance?.timeIn === "" && attendance?.timeOut === "")
                );
              }),
            )
          }
          className="text-white rounded-full cursor-pointer px-2 py-1 md:py-2 md:px-4 bg-tred text-xs md:text-sm font-normal text-center line-clamp-1"
        >
          Absent{" "}
          {team?.filter((e) => {
            const attendance = e?.t_attendances?.[0];
            return (
              !attendance ||
              (attendance?.timeIn === "" && attendance?.timeOut === "")
            );
          })?.length || 0}
        </span>
      </div>
    </div>
  );
};

const WorkflowApprovalCard = ({
  name,
  count,
  isApproval,
  approvalUrl,
  isWorkflow,
  workflowUrl,
}) => {
  return (
    <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between h-full">
      <div className="flex justify-between items-center">
        <span className="text-tprimary font-semibold text-base sm:text-lg flex items-center truncate line-clamp-1">
          {name}
        </span>
        <span className="text-tprimary text-base sm:text-xl font-semibold flex items-center truncate line-clamp-1">
          {count}
        </span>
      </div>
      <div className="font-size-xs flex flex-col text-black mt-2">
        <p className="m-0 underline text-xs">
          {isApproval ? (
            <a href={approvalUrl}>Request Approval </a>
          ) : (
            <label className="opacity-70 cursor-not-allowed text-xs">
              Request Approval{" "}
            </label>
          )}
        </p>
        <p className="m-0 underline text-xs">
          {isWorkflow ? (
            <a href={workflowUrl}>Workflow Status</a>
          ) : (
            <label className="opacity-70 cursor-not-allowed text-xs">
              Workflow Status{" "}
            </label>
          )}
        </p>
      </div>
    </div>
  );
};
