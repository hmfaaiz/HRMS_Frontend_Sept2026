import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { formatDates } from "../../../../../utils/common";

const localizer = momentLocalizer(moment);

export function FormTable() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState();
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  const { currentState } = useSelector((state) => ({
    currentState: state?.roster_calendar_team,
  }));

  const { rosterCalendar, dateRange } = currentState;

  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date();
    const sorted = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return new Date(sorted[0].date);
  };

  useEffect(() => {
    if (!rosterCalendar || !dateRange) return;

    const calendarEvents = rosterCalendar.map((roster) => ({
      title: `${
        roster?.t_employee_roster?.t_employee_profile?.employeeCode
      } - ${roster?.t_employee_roster?.t_employee_profile?.fullName} (${
        roster?.t_employee_shift?.name || "Off Day"
      })`,
      start: moment(roster?.date).toDate(),
      end: moment(roster?.date).endOf("day").toDate(),
      allDay: true,
      description: `${
        roster?.t_employee_roster?.t_employee_profile?.employeeCode
      } - ${
        roster?.t_employee_roster?.t_employee_profile?.fullName
      }\n${
        roster?.t_employee_shift?.name || "Off Day"
      }\n${formatDates(roster?.date, "dd/MM/yyyy")}\n(${
        roster?.t_employee_shift?.startTime || "0000"
      } - ${roster?.t_employee_shift?.endTime || "0000"})`,
      shift: roster?.t_employee_shift?.name || null,
    }));

    setEvents(calendarEvents);
    setSelectedRange({
      from: new Date(dateRange.formattedFromDate),
      to: new Date(dateRange.formattedToDate),
    });

    const earliestDate = getEarliestDate(rosterCalendar);
    setDefaultCalendarDate(earliestDate);
    setCurrentDate(earliestDate);
  }, [rosterCalendar, dateRange]);

  return (
    <div style={{ height: "800px" }}>
      {defaultCalendarDate && (
        <Calendar
          localizer={localizer}
          events={events}
          views={["month", "week", "day"]}
          defaultView="month"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          tooltipAccessor={(event) => event.description}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={{
            allDay: "All Day",
            previous: "<",
            next: ">",
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          min={selectedRange?.from}
          max={selectedRange?.to}
          components={{
            event: ({ event }) => (
              <div className="custom-tooltip">{event.title}</div>
            ),
          }}
          dayPropGetter={(date) => {
            const isToday = moment(date).isSame(new Date(), "day");
            if (isToday) {
              return {
                style: {
                  backgroundColor: "#ffffff",
                  border: "2px solid #0093dd",
                },
              };
            }
            return {};
          }}
          eventPropGetter={(event) => {
  if (!event.shift) {
    return {
      className: 'tooltip-absent'
    };
  }
  return {};
}}
        />
      )}
    </div>
  );
}