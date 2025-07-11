import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export function FormTable() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState();

  const [defaultCalendarDate, setDefaultCalendarDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.portal_holiday_calendar,
    };
  });

  const { holidayCalendar, dateRange } = currentState;

  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date(); // fallback

    const sorted = [...data].sort(
      (a, b) => new Date(a.from_date) - new Date(b.from_date)
    );
    return new Date(sorted[0].from_date);
  };

  useEffect(() => {
    const calendarEvents =
      holidayCalendar?.map((holiday) => ({
        title: holiday?.name,
        start: moment(holiday?.from_date).toDate(),
        end: moment(holiday?.to_date)
          .endOf("day")
          .toDate(),
        allDay: true,
        description: `${holiday?.name}  \n${holiday?.from_date} - ${holiday?.to_date} `,
      })) || [];

    setEvents(calendarEvents);
    setSelectedRange({
      from_date: new Date(dateRange.formattedFromDate), // Example from date
      to_date: new Date(dateRange.formattedToDate),
    });

    const earliestDate = getEarliestDate(holidayCalendar);
    setDefaultCalendarDate(earliestDate);
    setCurrentDate(earliestDate);
  }, [holidayCalendar, dispatch]);


  return (
    <div style={{ height: "1500px" }}>
      {/* Render the calendar */}
      {defaultCalendarDate && (
        <Calendar
          localizer={localizer}
          events={events}
          views={["month", "week", "day"]} // ✅ Agenda ko remove kiya yahan
          defaultView="month"
          date={currentDate} // Controlled date
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
          min={selectedRange?.from_date}
          max={selectedRange?.to_date}
          defaultDate={selectedRange?.from_date}
          // Optionally, you can customize navigation behavior to stay within range
          components={{
            event: ({ event }) => (
              <div className="custom-tooltip">{event.title}</div>
            ),
          }}
        />
      )}
    </div>
  );
}
