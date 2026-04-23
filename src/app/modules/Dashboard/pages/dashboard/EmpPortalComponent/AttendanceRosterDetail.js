import React from "react";
import { useSelector, shallowEqual } from "react-redux";

export function AttendanceRosterDetail({ entities }) {
  const {
    attendance_roster_request, attendance_roster_approval,
  } = useSelector(
    (state) => ({
      attendance_roster_request:
        state?.auth?.userAccess["attendance_roster_request"],
      attendance_roster_approval:
        state?.auth.userAccess["attendance_roster_approval"]
  
    }),
    shallowEqual,
  );

  const isAttendanceRosterRequest = attendance_roster_request?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterRequest" &&
      el?.portalType == 2,
  );
  const isAttendanceRosterApproval = attendance_roster_approval?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRosterApproval" &&
      el?.portalType == 2,
  );


  return (
    <div className="w-full text-sm px-3 py-2 bg-white rounded-lg">
      <h6 className="font-bold mb-0 text-primary my-2">Attendance Roster</h6>
      {isAttendanceRosterRequest ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a
              href={
                "/attendance_roster_request/read-all-attendance-roster-request"
              }
            >
              Attendance Roster Request
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Attendance Roster Request</p>
      )}
      {isAttendanceRosterApproval ? (
        <div className="font-size-xs text-black font-bold">
          <p className="m-0 underline">
            <a
              href={
                "/attendance_roster_approval/read-all-attendance-roster-approval"
              }
            >
              Attendance Roster Approval
            </a>
          </p>
        </div>
      ) : (
        <p className="text-sm mb-0">Attendance Roster Approval</p>
      )}
    </div>
  );
}
