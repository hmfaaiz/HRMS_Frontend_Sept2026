import React, { useState, useEffect } from "react";
import { parse } from "date-fns";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { CalendarCheck, CalendarMinus, CalendarRange } from "lucide-react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

export const convertHolidaysToEvents = (holidayList) => {
  return holidayList.map((holiday) => {
    const start = parse(holiday.from_date, "dd-MMM-yyyy", new Date());
    const end = parse(holiday.to_date, "dd-MMM-yyyy", new Date());
    return {
      id: holiday.Id,
      title: holiday.name,
      start,
      end,
      description: holiday.name,
      color_key: "holiday",
    };
  });
};

const localizer = momentLocalizer(moment);

const PortalCalendarLink = {
  Leave: "/leave_calendar_team/read-leave-calendar",
  Att: "/attendance_calendar_team/read-attendance-calendar",
  Roster: "/roster_calendar_team/read-roster-calendar",
};

const HRMSCalendarLink = {
  Leave: "/leave_calendar/read-leave-calendar",
  Att: "/attendance_calendar/read-attendance-calendar",
  Roster: "/roster_calendar/read-roster-calendar",
};

export function HolidayTable({ entities }) {
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isPortal, setIsPortal] = useState(() => {
    return JSON.parse(localStorage.getItem("isEmployeePortal")) || false;
  });

  const { userAccess, moduleRights } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess,
      moduleRights: state?.dashboard?.moduleRights,
    }),
    shallowEqual,
  );

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const portalValue =
        JSON.parse(localStorage.getItem("isEmployeePortal")) || false;
      setIsPortal(portalValue);
    };

    // Listen for storage events (for cross-tab changes)
    window.addEventListener("storage", handleStorageChange);

    // Optional: Custom event for same-tab changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      const event = new Event("localStorageChange");
      originalSetItem.apply(this, arguments);
      if (key === "isEmployeePortal") {
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("localStorageChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const rosterPortal = userAccess?.Attendance?.find(
    (el) =>
      el?.componentName == "ReadRosterCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const rosterHRMS = userAccess?.["Attendance Management"]?.find(
    (el) =>
      el?.componentName == "ReadRosterCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 1,
  );

  const attPortal = userAccess?.Attendance?.find(
    (el) =>
      el?.componentName == "ReadAttendanceCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const attHRMS = userAccess?.["Attendance Management"]?.find(
    (el) =>
      el?.componentName == "ReadAttendanceCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 1,
  );

  const leavePortal = userAccess?.Leave?.find(
    (el) =>
      el?.componentName == "ReadLeaveCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 2,
  );

  const leaveHRMS = userAccess?.["Leave Management"]?.find(
    (el) =>
      el?.componentName == "ReadLeaveCalendar" &&
      el?.isResourceShow &&
      el?.portalType == 1,
  );

  const CalendarSection = [
    {
      icon: <CalendarCheck className="w-4 h-4 text-black " />,
      name: "Attendance Calendar",
      isShow: moduleRights?.find((e) => e?.value == 3)?.allow,
      link:
        isPortal && attPortal
          ? PortalCalendarLink["Att"]
          : !isPortal && attHRMS
          ? HRMSCalendarLink["Att"]
          : "",
    },
    {
      icon: <CalendarRange className="w-4 h-4 text-black " />,
      name: "Roster Calender",
      isShow: moduleRights?.find((e) => e?.value == 3)?.allow,
      link:
        isPortal && rosterPortal
          ? PortalCalendarLink["Roster"]
          : !isPortal && rosterHRMS
          ? HRMSCalendarLink["Roster"]
          : "",
    },
    {
      icon: <CalendarMinus className="w-4 h-4 text-black " />,
      name: "Leave Calender",
      isShow: moduleRights?.find((e) => e?.value == 2)?.allow,
      link:
        isPortal && leavePortal
          ? PortalCalendarLink["Leave"]
          : !isPortal && leaveHRMS
          ? HRMSCalendarLink["Leave"]
          : "",
    },
  ];

  useEffect(() => {
    setEvents(convertHolidaysToEvents(entities));
  }, [entities]);

  return (
    <div className="w-full col-span-1 font-size-xs px-3 py-2 bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h6 className="font-weight-bolder mb-0 text-primary my-2">
          Holiday Calendar
        </h6>
        <div className="flex gap-2">
          {CalendarSection?.filter((el) => el?.isShow && el?.link)?.map(
            (e, index) => {
              return (
                <div
                  key={index}
                  title={e.name}
                  style={{ border: "1px solid black" }}
                  className="bg-tsecondary px-1 pb-1 pt-0.5 cursor-pointer rounded-sm"
                  onClick={() => {
                    if (e.link) {
                      // window.location.href = e.link;
                      history.push(e?.link);
                    }
                  }}
                >
                  {e.icon}
                </div>
              );
            },
          )}
        </div>
      </div>
      <div className="p-1 h-[350px]">
        <Calendar
          localizer={localizer}
          events={events}
          views={["month"]}
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor={(event) => event.description}
          style={{ height: "100%" }}
          messages={{
            previous: "<",
            next: ">",
          }}
          dayPropGetter={(date) => {
            const day = moment(date).day();
            const isToday = moment(date).isSame(new Date(), "day");

            if (isToday) {
              return {
                style: {
                  backgroundColor: "#ffffff",
                  border: "2px solid #0093dd",
                },
              };
            }

            if (day === 0 || day === 6) {
              return {
                style: {
                  backgroundColor: "#E6F8FF",
                },
              };
            }

            return {};
          }}
        />
      </div>
    </div>
  );
}
