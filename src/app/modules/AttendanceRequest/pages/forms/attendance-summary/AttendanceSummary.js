import React from "react";
import { useSelector } from "react-redux";
export const AttendanceSummary = () => {
  const { attendanceSummary } = useSelector((state) => {
    return { attendanceSummary: state?.attendance_request?.attendanceSummary };
  });
  return (
    <div
      style={{
        backgroundColor: "rgb(235 243 255)",
        margin: "15px",
        padding: "20px",
        borderRadius: "5px",
        border: "2px solid #adceff",
      }}
    >
      <h4>Attendance Summary</h4>
      <div className="row">
        <div className="col-1">
          <span className="font-weight-bold">Present</span>
        </div>
        <div className="col-1">{attendanceSummary?.PresentDays || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Absent Days</span>
        </div>
        <div className="col-1">{attendanceSummary?.AbsentDays || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Holidays</span>
        </div>
        <div className="col-1">{attendanceSummary?.Holidays || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Off Days</span>
        </div>
        <div className="col-1">{attendanceSummary?.OffDay || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Leave Days</span>
        </div>
        <div className="col-1">{attendanceSummary?.LeaveDays || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">On Time</span>
        </div>
        <div className="col-1">{attendanceSummary?.OnTime || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Late In</span>
        </div>
        <div className="col-1">{attendanceSummary?.LateComing || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Early Out</span>
        </div>
        <div className="col-1">{attendanceSummary?.EarlyGoing || 0} </div>
        <div className="col-1">
          <span className="font-weight-bold">Half Days</span>
        </div>
        <div className="col-1">{attendanceSummary?.HalfDay || 0} </div>
      </div>
    </div>
  );
};
