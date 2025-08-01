import React from "react";
import { Link } from "react-router-dom";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
  loanApprovalCount,
}) => {
  return (
    <div className="p-3 rounded-lg bg-white w-full flex flex-col max-h-max sm:max-h-56 overflow-y-auto justify-between">
      <h6 className="font-bold mb-0 text-primary my-2">Pending Request</h6>
      <div className="d-flex sm:flex-row flex-col max-sm:gap-2 w-full mb-2">
        <div className="bg-tsecondary font-weight-bolder   w-full px-4 py-3 gap-2 sm:gap-5 lg:gap-11 rounded-lg sm:mx-2 d-flex flex-column justify-content-between">
          <div className="text-primary d-flex  justify-content-between">
            <h6 className="m-0 text-lg font-bold">Attendance</h6>
            <h6 className="m-0 text-lg font-bold">{attendanceApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
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
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg sm:mr-2 d-flex flex-column gap-2 sm:gap-5 lg:gap-11 justify-content-between">
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-lg font-bold">Leave</h6>
            <h6 className="m-0 text-lg font-bold">{leaveApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
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
        <div className="bg-tsecondary font-weight-bolder w-full px-4 py-3 rounded-lg sm:ml-2 d-flex gap-2 sm:gap-5 lg:gap-11   flex-column justify-content-between">
          <div className="text-primary d-flex justify-content-between">
            <h6 className="m-0 text-lg font-bold">Loan</h6>
            <h6 className="m-0 text-lg font-bold">{loanApprovalCount}</h6>
          </div>
          <div className="font-size-xs flex flex-col max-sm:flex-row  max-sm:gap-4 text-black mt-2">
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
