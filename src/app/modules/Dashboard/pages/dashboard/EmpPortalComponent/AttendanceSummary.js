import React from "react";
import { Link } from "react-router-dom";
import DonutChart from "../../../../../../component/DonutChart";
import { useSelector, shallowEqual } from "react-redux";

export const AttendanceSummary = ({ attendanceSummary }) => {
  const { attendance } = useSelector(
    (state) => ({
      attendance: state?.auth?.userAccess["Attendance"],
    }),
    shallowEqual
  );

  const isAttRequest = attendance?.find(
    (el) =>
      el?.componentName === "ReadAllAttendanceRequest" && el?.isResourceShow
  );
  const isAttCalendar = attendance?.find(
    (el) => el?.componentName === "ReadAttendanceCalendar" && el?.isResourceShow
  );

  const isHolidayCalendar = attendance?.find(
    (el) => el?.componentName === "MyHolidayCalendar" && el?.isResourceShow
  );

  const attendanceFields = [
    { label: "Present Days", key: "PresentDays" },
    { label: "On Time", key: "OnTime" },
    { label: "Absent Days", key: "AbsentDays" },
    { label: "Late In", key: "LateComing" },
    { label: "Holidays", key: "Holidays" },
    { label: "Early Out", key: "EarlyGoing" },
    { label: "Off Days", key: "OffDay" },
    { label: "Half Days", key: "HalfDay" },
    { label: "Leave Days", key: "LeaveDays" },
  ];
  return (
    <div className="w-full bg-white rounded-lg">
      <div className="w-full text-xs px-3 py-2  flex flex-col h-full justify-between">
        <div className="w-full">
          <h6 className="font-bold mb-0 text-primary my-2">Attendance</h6>
          <DonutChart
            data={
              attendanceSummary && Object.keys(attendanceSummary).length > 0
                ? Object.entries(attendanceSummary)
                    .filter(([key]) => key !== "Id" && key !== "FirstName")
                    .map(([key, value]) => ({
                      label: key,
                      value: value,
                    }))
                : []
            }
          />
        </div>
        <div className="grid grid-cols-2 text-sm gap-x-8 mt-5">
          {attendanceFields.map(({ label, key }) => (
            <div key={key} className="flex justify-between items-center">
              <p className="text-black m-0">{label}</p>
              <p className="text-primary font-extrabold m-0">
                {attendanceSummary?.[key] || 0}
              </p>
            </div>
          ))}
        </div>
        <div className="font-size-xs font-semibold flex gap-4 items-end text-black mt-2 flex-wrap">
          <p className="m-0 underline">
            {isAttRequest ? (
              <Link to="/attendance_request/read-all-attendance-request">
                Attendance Request
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Attendance Request
              </label>
            )}
          </p>
          <p className="m-0 underline">
            {isAttCalendar ? (
              <Link to="/attendance_calendar_team/read-attendance-calendar">
                Attendance Calendar
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Attendance Calendar
              </label>
            )}
          </p>
          <p className="m-0 underline">
            {isHolidayCalendar ? (
              <Link to="/holiday_calendar/my-holiday-calendar">
                Holiday Calendar
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Holiday Calendar
              </label>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
