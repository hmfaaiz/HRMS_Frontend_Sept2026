import React from "react";
import { a } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
  loanApprovalCount,
  resignationApprovalCount,
}) => {
  const { leave, loan, attendance, resignation } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
      loan: state?.auth?.userAccess["Payroll"],
      attendance: state?.auth?.userAccess["Attendance"],
      resignation: state?.auth?.userAccess["Resignation"],
    }),
    shallowEqual
  );

  const isLeaveApproval = leave?.find(
    (el) => el?.componentName === "ReadAllLeaveApproval" && el?.isResourceShow
  );
  const isLeaveWorkflowStatus = leave?.find(
    (el) =>
      el?.componentName === "ReadAllLeaveWorkflowStatus" && el?.isResourceShow
  );
  const isLoanApproval = loan?.find(
    (el) => el?.componentName === "ReadAllLoanApproval" && el?.isResourceShow
  );
  const isLoanWorkflowStatus = loan?.find(
    (el) =>
      el?.componentName === "ReadAllLoanWorkflowStatus" && el?.isResourceShow
  );
  const isAttApproval = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceApproval" && el?.isResourceShow
  );
  const isAttWorkflowStatus = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceWorkflowStatus" &&
      el?.isResourceShow
  );

  const isSeparationApproval = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignationApproval" && el?.isResourceShow
  );
  const isSeparationWorkflowStatus = resignation?.find(
    (el) =>
      el?.componentName === "ReadAllResignationWorkflowStatus" &&
      el?.isResourceShow
  );
  return (
    <div className="p-3 rounded-lg bg-white w-full flex flex-col max-h-max sm:max-h-56 overflow-y-auto justify-between">
      <h6 className="font-bold mb-0 text-primary my-2">Subordinate Pending Requests</h6>
      <div className="grid grid-cols-1  sm:grid-cols-4 gap-2 w-full mb-2">
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 gap-2 sm:gap-5 lg:gap-11 rounded-lg d-flex flex-column justify-content-between">
          <div className="text-primary d-flex  justify-content-between">
            <h6 className="m-0 text-lg font-bold">Attendance</h6>
            <h6 className="m-0 text-lg font-bold">{attendanceApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
            <p className="m-0 underline">
              {isAttApproval ? (
                <a href={"/attendance_approval/read-all-attendance-approval"}>
                  Request Approval{" "}
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Request Approval{" "}
                </label>
              )}
            </p>
            <p className="m-0 underline">
              {isAttWorkflowStatus ? (
                <a
                  href={
                    "/attendance-workflow-status/read-all-attendance-workflow-status"
                  }
                >
                  Workflow Status
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Workflow Status{" "}
                </label>
              )}
            </p>
          </div>
        </div>
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg  d-flex flex-column gap-2 sm:gap-5 lg:gap-11 justify-content-between">
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-lg font-bold">Leave</h6>
            <h6 className="m-0 text-lg font-bold">{leaveApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
            <p className="m-0 underline ">
              {isLeaveApproval ? (
                <a href={"/leave-approval/read-all-leave-approval"}>
                  Request Approval{" "}
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Request Approval{" "}
                </label>
              )}
            </p>
            <p className="m-0 underline">
              {isLeaveWorkflowStatus ? (
                <a
                  href={"/leave-workflow-status/read-all-leave-workflow-status"}
                >
                  Workflow Status
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Workflow Status{" "}
                </label>
              )}
            </p>
          </div>
        </div>
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg  d-flex gap-2 sm:gap-5 lg:gap-11   flex-column justify-content-between">
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-lg font-bold">Loan</h6>
            <h6 className="m-0 text-lg font-bold">{loanApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
            <p className="m-0 underline">
              {isLoanApproval ? (
                <a href={"/loan_approval/read-all-loan-approval"}>
                  Request Approval{" "}
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Request Approval{" "}
                </label>
              )}
            </p>
            <p className="m-0 underline">
              {isLoanWorkflowStatus ? (
                <a
                  href={"/loan-workflow-status/read-all-loan-workflow-status"}
                >
                  Workflow Status
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Workflow Status{" "}
                </label>
              )}
            </p>
          </div>
        </div>
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg  d-flex gap-2 sm:gap-5 lg:gap-11   flex-column justify-content-between">
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-lg font-bold">Resignation</h6>
            <h6 className="m-0 text-lg font-bold">{resignationApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
            <p className="m-0 underline">
              {isSeparationApproval ? (
                <a
                  href={"/resignation_approval/read-all-resignation-approval"}
                >
                  Request Approval{" "}
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Request Approval{" "}
                </label>
              )}
            </p>
            <p className="m-0 underline">
              {isSeparationWorkflowStatus ? (
                <a
                  href={
                    "/resignation_workflow_status/read-all-resignation-workflow-status"
                  }
                >
                  Workflow Status
                </a>
              ) : (
                <label className="opacity-50 cursor-not-allowed">
                  Workflow Status{" "}
                </label>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
