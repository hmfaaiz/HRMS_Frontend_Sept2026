import React from "react";
import { Link } from "react-router-dom";
export const PendingRequestSelf = ({
  attendanceApprovalCount,
  leaveApprovalCount,
}) => {
  return (
    <div
      style={{
        backgroundColor: "rgb(235 243 255)",
        margin: "15px",
        padding: "20px",
        borderRadius: "5px",
        border: "2px solid #adceff",
        width: "100%",
      }}
    >
      <h3>Pending Request Self</h3>
      <hr />
      <br />
      <div className="row">
        <span className="col-6">Leave Request</span>
        <span className="col-6 text-underline cursor-pointer">
          <Link target="_blank" to={"/leave-approval/read-all-leave-approval"}>
            {leaveApprovalCount}
          </Link>
        </span>
      </div>
      <hr />
      <div className="row">
        <span className="col-6">Attendance Request</span>

        <span className="col-6 text-underline cursor-pointer">
          <Link target="_blank" to={"/attendance_approval/read-all-attendance-approval"}>
            {attendanceApprovalCount}
          </Link>
        </span>
      </div>
    </div>
  );
};
