import React from "react";
import { Link } from "react-router-dom";
import DonutChart from "../../../../../../component/DonutChart";
import { useSelector, shallowEqual } from "react-redux";

export function LeaveBalanceDetail({ leaveBalances }) {
  const { leave } = useSelector(
    (state) => ({
      leave: state?.auth?.userAccess["Leave"],
    }),
    shallowEqual
  );
  const isLeaveRequest = leave?.find(
    (el) => el?.componentName === "ReadAllLeaveRequest" && el?.isResourceShow
  );
  const isLeaveCalendar = leave?.find(
    (el) => el?.componentName === "ReadLeaveCalendar" && el?.isResourceShow
  );
  return (
    <div className="px-3 py-2 w-full bg-white rounded-lg ">
      <div className="w-full text-xs flex flex-col h-full justify-between">
        <div className="w-full ">
          <h6 className="font-bold mb-0 text-primary my-2">Leave</h6>
          <DonutChart
            data={
              Array.isArray(leaveBalances)
                ? leaveBalances.map((item) => ({
                    label: item.leaveTypeName,
                    value: item.remainingCount,
                  }))
                : []
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-x-8">
          {leaveBalances?.length > 0 &&
            leaveBalances?.map((el, i) => {
              return (
                <div
                  className="flex justify-between items-center text-sm"
                  key={el?.leaveTypeName || i}
                >
                  <p className="text-black m-0 p-0">{el?.leaveTypeName}</p>
                  <p className="text-primary font-extrabold m-0">
                    {el?.remainingCount || 0}
                  </p>
                </div>
              );
            })}
        </div>
        <div className="font-size-xs font-semibold flex gap-4 items-end text-black mt-2 flex-wrap">
          <p className="m-0 underline">
            {isLeaveRequest ? (
              <Link to={"/leave-request/read-all-leave-request"}>
                Leave Request
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Leave Request
              </label>
            )}
          </p>
          <p className="m-0 underline">
            {isLeaveCalendar ? (
              <Link to={"/leave_calendar_team/read-leave-calendar"}>
                Leave Calendar
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Leave Calendar
              </label>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
