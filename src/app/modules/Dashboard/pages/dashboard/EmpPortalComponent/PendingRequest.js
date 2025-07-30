import React from "react";
import { Link } from "react-router-dom";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
  loanApprovalCount,
}) => {
  return (
    <div className="p-3 rounded-lg bg-white w-full flex flex-col max-h-56 overflow-y-auto justify-between">
      <h6 className="font-bold mb-0 text-primary my-2">Pending Request</h6>
      <div className="d-flex w-full mb-2">
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder   w-full px-4 py-3 gap-11 rounded-lg mx-2 d-flex flex-column justify-content-between"
        >
          <div className="text-primary d-flex  justify-content-between">
            <h6 className="m-0 text-2xl font-semibold">Attendance</h6>
            <h6 className="m-0 text-2xl font-semibold">
              {attendanceApprovalCount}
            </h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 underline">
              <Link to={"/attendance_approval/read-all-attendance-approval"}>
                Request Approval{" "}
              </Link>
            </p>
            <p className="m-0 underline">
              <Link
                to={
                  "/attendance-workflow-status/read-all-attendance-workflow-status"
                }
              >
                Workflow Status
              </Link>
            </p>
          </div>
        </div>
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder w-full px-4 py-3 rounded-lg mr-2 d-flex flex-column gap-11 justify-content-between"
        >
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-2xl font-semibold">Leave</h6>
            <h6 className="m-0 text-2xl font-semibold">{leaveApprovalCount}</h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 underline ">
              <Link to={"/leave-approval/read-all-leave-approval"}>
                Request Approval{" "}
              </Link>
            </p>
            <p className="m-0 underline">
              <Link
                to={"/leave-workflow-status/read-all-leave-workflow-status"}
              >
                Workflow Status
              </Link>
            </p>
          </div>
        </div>
        <div
          style={{ background: "#E6F8FF" }}
          className="font-weight-bolder w-full px-4 py-3 rounded-lg ml-2 d-flex gap-11   flex-column justify-content-between"
        >
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-2xl font-semibold">Loan</h6>
            <h6 className="m-0 text-2xl font-semibold">{loanApprovalCount}</h6>
          </div>
          <div className="font-size-xs text-black mt-2">
            <p className="m-0 underline">
              <Link to={"/loan_approval/read-all-loan-approval"}>
                Request Approval{" "}
              </Link>
            </p>
            <p className="m-0 underline">
              <Link to={"/loan-workflow-status/read-all-loan-workflow-status"}>
                Workflow Status
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
