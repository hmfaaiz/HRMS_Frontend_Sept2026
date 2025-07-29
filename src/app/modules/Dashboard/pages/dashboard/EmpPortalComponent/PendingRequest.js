import React from "react";
import { Link } from "react-router-dom";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
  loanApprovalCount,
}) => {
  return (
    <div
      className="p-3 rounded-lg bg-white w-full"
    >
      <h6 className="font-weight-bolder text-primary">Pending Request</h6>
      <div className="d-flex w-full mt-3">
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder w-full px-4 py-3 rounded-lg mr-2 d-flex flex-column justify-content-between"
        >
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-sm">Leave Approval</h6>
            <h6 className="m-0 text-sm">{leaveApprovalCount}</h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 text-underline ">
              <Link to={"/leave-approval/read-all-leave-approval"}>
                Leave Approval{" "}
              </Link>
            </p>
            <p className="m-0 text-underline">
              <Link
                to={"/leave-workflow-status/read-all-leave-workflow-status"}
              >
                Leave Workflow Status
              </Link>
            </p>
          </div>
        </div>
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder   w-full px-4 py-3 rounded-lg mx-2 d-flex flex-column justify-content-between"
        >
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-sm">Attendance Approval</h6>
            <h6 className="m-0 text-sm">{attendanceApprovalCount}</h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 text-underline">
              <Link to={"/attendance_approval/read-all-attendance-approval"}>
                Attendance Approval{" "}
              </Link>
            </p>
            <p className="m-0 text-underline">
              <Link
                to={
                  "/attendance-workflow-status/read-all-attendance-workflow-status"
                }
              >
                Attendance Workflow Status
              </Link>
            </p>
          </div>
        </div>
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder w-full px-4 py-3 rounded-lg ml-2 d-flex flex-column justify-content-between"
        >
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-sm">Loan Approval</h6>
            <h6 className="m-0 text-sm">{loanApprovalCount}</h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 text-underline">
              <Link to={"/loan_approval/read-all-loan-approval"}>
                Loan Approval{" "}
              </Link>
            </p>
            <p className="m-0 text-underline">
              <Link to={"/loan-workflow-status/read-all-loan-workflow-status"}>
                Loan Workflow Status
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
