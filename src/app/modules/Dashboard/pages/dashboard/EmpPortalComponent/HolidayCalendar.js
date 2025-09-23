import React, { useState, useEffect } from "react";
import { parse } from "date-fns";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

export function HolidayTable({ entities }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(convertHolidaysToEvents(entities));
  }, [entities]);

  return (
    <div className="w-full col-span-1 font-size-xs px-3 py-2 bg-white rounded-lg">
      <h6 className="font-weight-bolder mb-0 text-primary my-2">
        Holiday Calendar
      </h6>
      <div className="p-1 h-[350px]">
        {/* <Calendar
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
          components={{
            event: ({ event }) => (
              <div className="event-cell" title={event.description}>
                {event.title}
              </div>
            ),
          }}
          eventPropGetter={() => {
            return {
              className: "bg-[#0093dd]",
            };
          }}
        /> */}
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
            const day = moment(date).day(); // 0 = Sunday, 6 = Saturday
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
                  backgroundColor: "#E6F8FF", // Light green weekends
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
