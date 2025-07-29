import React from "react";
import { Link } from "react-router-dom";
import DonutChart from "../../../../../../component/DonutChart";

export const AttendanceSummary = ({ attendanceSummary }) => {
  return (
    <div className="w-full bg-white rounded-lg">
      <div className="w-full min-h-48 text-xs px-3 py-2  flex flex-col h-full justify-between">
        <h6 className="font-bold mb-0 text-primary my-2">Attendance</h6>
        <div className="w-full">
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
        <div className="grid grid-cols-2 text-sm gap-8 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Present Days</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.PresentDays || 0}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-black m-0">On Time</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.OnTime || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-sm gap-8">
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Absent Days</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.AbsentDays || 0}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Late In</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.LateComing || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-sm gap-8">
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Holidays</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.Holidays || 0}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Early Out</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.EarlyGoing || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-sm gap-8">
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Off Days</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.OffDay || 0}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Half Days</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.HalfDay || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 text-sm gap-8">
          <div className="flex justify-between items-center">
            <p className="text-black m-0">Leave Days</p>
            <p className="text-primary font-extrabold m-0">
              {attendanceSummary?.LeaveDays || 0}
            </p>
          </div>
        </div>

        <div className="text-xs flex gap-4 items-end text-black mt-2 flex-wrap">
          <p className="m-0 underline">
            <Link to="/attendance_request/read-all-attendance-request">
              Attendance Request
            </Link>
          </p>
          <p className="m-0 underline">
            <Link to="/attendance_calendar_team/read-attendance-calendar">
              Attendance Calendar
            </Link>
          </p>
          <p className="m-0 underline">
            <Link to="/holiday_calendar/my-holiday-calendar">
              Holiday Calendar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
