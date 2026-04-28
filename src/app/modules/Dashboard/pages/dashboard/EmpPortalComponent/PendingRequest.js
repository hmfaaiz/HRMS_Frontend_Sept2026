import React from "react";
import { useSelector, shallowEqual } from "react-redux";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
  loanApprovalCount,
  resignationApprovalCount,
  rosterApproval,
  tadaApproval,
  reimbApproval,
  moduleRights,
}) => {
  const {
    leave,
    loan,
    attendance,
    resignation,
    reimbursement_claim_approval,
    roster,
    tada,
  } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
      loan: state?.auth?.userAccess["Payroll"],
      roster: state?.auth?.userAccess["Attendance Management"],
      attendance: state?.auth?.userAccess["Attendance"],
      resignation: state?.auth?.userAccess["Resignation"],
      tada: state?.auth?.userAccess["Payroll"],
      reimbursement_claim_approval: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual,
  );
  //// leave
  const isLeaveApproval = leave?.find(
    (el) => el?.componentName === "ReadAllLeaveApproval" && el?.isResourceShow,
  );
  const isLeaveWorkflowStatus = leave?.find(
    (el) =>
      el?.componentName === "ReadAllLeaveWorkflowStatus" && el?.isResourceShow,
  );
  /// attendance
  const isAttApproval = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceApproval" && el?.isResourceShow,
  );
  const isAttWorkflowStatus = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceWorkflowStatus" &&
      el?.isResourceShow,
  );
  /// roster
  const isRostApproval = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterApproval" &&
      el?.isResourceShow,
  );
  const isRostWorkflowStatus = roster?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterWorkflowStatusPortal" &&
      el?.isResourceShow,
  );
  // loan
  const isLoanApproval = loan?.find(
    (el) => el?.componentName === "ReadAllLoanApproval" && el?.isResourceShow,
  );
  const isLoanWorkflowStatus = loan?.find(
    (el) =>
      el?.componentName === "ReadAllLoanWorkflowStatus" && el?.isResourceShow,
  );

  /// tada
  const isTadaApproval = tada?.find(
    (el) =>
      (el?.componentName === "ReadAllTravelRequestApproval" ||
        el?.slug === "read-all-travel-request-approval") &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const isTadaWorkflowStatus = tada?.find(
    (el) =>
      (el?.componentName === "ReadAllTravelRequestWorkflowStatus" ||
        el?.slug === "read-all-travel-request-workflow-status") &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  /// reimbursment
  const isReimbursementApproval = reimbursement_claim_approval?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimApproval" &&
      el?.isResourceShow,
  );

  const isReimbursementWorkflowStatus = reimbursement_claim_approval?.find(
    (el) =>
      el?.componentName === "ReadAllReimbursementClaimWorkflowStatus" &&
      el?.isResourceShow,
  );
  //// resignation
  const isSeparationApproval = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignationApproval" && el?.isResourceShow,
  );
  const isSeparationWorkflowStatus = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignationWorkflowStatus" &&
      el?.isResourceShow,
  );

  return (
    <>
      {moduleRights?.find((e) => e?.value == 3)?.allow ||
      moduleRights?.find((e) => e?.value == 2)?.allow ||
      moduleRights?.find((e) => e?.value == 4)?.allow ||
      moduleRights?.find((e) => e?.value == 4)?.allow ||
      moduleRights?.find((e) => e?.value == "separation")?.allow ? (
        <div className="p-3 rounded-lg bg-white w-full flex max-h-64 flex-col overflow-y-auto justify-between">
          <h6 className="font-bold mb-0 text-primary my-2">
            Subordinate Pending Requests
          </h6>
          {/* Updated grid classes */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1.5 w-full mb-2">
            {/* leave   */}
            {moduleRights?.find((e) => e?.value == 2)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex flex-column gap-1 justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Leave</h6>
                  <h6 className="m-0 text-md font-bold">
                    {leaveApprovalCount}
                  </h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isLeaveApproval ? (
                      <a href="/leave-approval/read-all-leave-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isLeaveWorkflowStatus ? (
                      <a href="/leave-workflow-status/read-all-leave-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/* attendance  */}
            {moduleRights?.find((e) => e?.value == 3)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 gap-1 rounded-lg d-flex flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Attendance</h6>
                  <h6 className="m-0 text-md font-bold">
                    {attendanceApprovalCount}
                  </h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isAttApproval ? (
                      <a href="/attendance_approval/read-all-attendance-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isAttWorkflowStatus ? (
                      <a href="/attendance-workflow-status/read-all-attendance-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/* roster  */}
            {moduleRights?.find((e) => e?.value == 3)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 gap-1 rounded-lg d-flex flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Roster</h6>
                  <h6 className="m-0 text-md font-bold">{rosterApproval}</h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isRostApproval ? (
                      <a href="/attendance_roster_approval/read-all-attendance-roster-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isRostWorkflowStatus ? (
                      <a href="/attendance_roster_workflow_status_portal/read-all-attendance-roster-workflow-status-portal">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/* loan  */}
            {moduleRights?.find((e) => e?.value == 4)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Loan</h6>
                  <h6 className="m-0 text-md font-bold">{loanApprovalCount}</h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isLoanApproval ? (
                      <a href="/loan_approval/read-all-loan-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isLoanWorkflowStatus ? (
                      <a href="/loan-workflow-status/read-all-loan-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/* ta da  */}
            {moduleRights?.find((e) => e?.value == 4)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Travel</h6>
                  <h6 className="m-0 text-md font-bold">{tadaApproval}</h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isTadaApproval ? (
                      <a href="/travel_request_approval/read-all-travel-request-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isTadaWorkflowStatus ? (
                      <a href="/travel_request_workflow_status/read-all-travel-request-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/* reimbursement  */}
            {moduleRights?.find((e) => e?.value == 4)?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Claim</h6>
                  <h6 className="m-0 text-md font-bold">{reimbApproval}</h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isReimbursementApproval ? (
                      <a href="/reimbursement_claim_approval/read-all-reimbursement-claim-approval">
                        Request Approval
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isReimbursementWorkflowStatus ? (
                      <a href="/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            {/*  resignation */}
            {moduleRights?.find((e) => e?.value == "separation")?.allow ? (
              <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg d-flex gap-1 flex-column justify-content-between">
                <div className="text-primary d-flex justify-content-between">
                  <h6 className="m-0 text-md font-bold">Resignation</h6>
                  <h6 className="m-0 text-md font-bold">
                    {resignationApprovalCount}
                  </h6>
                </div>
                <div className="font-size-xs flex flex-col max-sm:flex-row max-sm:gap-4 text-black mt-2">
                  <p className="m-0 underline text-xs">
                    {isSeparationApproval ? (
                      <a href="/resignation_approval/read-all-resignation-approval">
                        Request Approval{" "}
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Request Approval{" "}
                      </label>
                    )}
                  </p>
                  <p className="m-0 underline text-xs">
                    {isSeparationWorkflowStatus ? (
                      <a href="/resignation_workflow_status/read-all-resignation-workflow-status">
                        Workflow Status
                      </a>
                    ) : (
                      <label className="opacity-70 cursor-not-allowed text-xs">
                        Workflow Status{" "}
                      </label>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};
