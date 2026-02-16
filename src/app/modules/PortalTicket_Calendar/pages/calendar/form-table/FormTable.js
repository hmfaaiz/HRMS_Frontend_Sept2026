
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export function FormTable() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState();
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);




  const { currentState } = useSelector(
    (state) => {

      return {
        currentState: state?.ticket_calendar,
      };
    }
  );

  const { ticketCalendar, dateRange } = currentState;

  // const getEarliestDate = (data) => {
  //   if (!data || data.length === 0) return new Date();

  //   const sorted = [...data].sort(
  //     (a, b) =>
  //       moment(a.dueDate, "DD-MMM-YYYY").toDate() -
  //       moment(b.dueDate, "DD-MMM-YYYY").toDate()
  //   );

  //   return moment(sorted[0].dueDate, "DD-MMM-YYYY").toDate();
  // };


  const getEarliestDate = (data) => {



    if (!data || data.length === 0) return new Date(); // fallback

    const sorted = [...data].sort(
      (a, b) => new Date(a.from) - new Date(b.from)
    );
    return new Date(sorted[0].from);
  };




  useEffect(() => {
    const calendarEvents = [];

    (ticketCalendar || []).forEach((data) => {
   
      calendarEvents.push({
        title: data.sourceType === "FACILITATOR"
           ? `${data?.EmployeeProfileReceive?.employeeCode || data?.EmployeeProfile?.employeeCode || ""} - ${data?.EmployeeProfileReceive?.fullNameReceive || data?.EmployeeProfile?.fullName || ""}`

          : data.sourceType === "TICKET"
            ? `${data?.AssignToEmp?.employeeCode} - ${data?.AssignToEmp?.fullName}`
            : data.sourceType === "TIMELOG"
              ? `${data?.Employee?.employeeCode} - ${data?.Employee?.fullName}`
              : "Unknown", // fallback if sourceType doesn't match

        start: moment(data.from, "DD-MMM-YYYY").toDate(),
        end: moment(data.to, "DD-MMM-YYYY").endOf("day").toDate(),
        description: data.sourceType === "FACILITATOR"
          ? data?.ticketDescription
          : data.sourceType === "TICKET"
            ? data?.ticketSummary
            : data.sourceType === "TIMELOG"
              ? data?.workDescription
              : "",
        sourceType: data.sourceType,
        timeRange: `${data?.timeRangeFrom} - ${data?.timeRangeTo}`,
        dateRange: `${data?.from} - ${data?.to}`,
        noOfHours: `${data?.noOfHours}`,
 
        ticket:
          data.sourceType === "TIMELOG"
            ? data?.MasterDetailTimeLog
              ? <>
            {data.MasterDetailTimeLog.ticketCode} <br />
                {data.MasterDetailTimeLog.ticketDescription} - {data.noOfHours}
              </>
              :
              data?.Ticket
              ? <>
                 {data.Ticket.ticketCode} <br />
                {data.Ticket.ticketDescription} - {data.noOfHours}
              </>
              :
              
              "No Ticket Linked"
            : <>
              {data?.ticketCode} <br />
              {data?.ticketDescription}
            </>


      });




      return; // skip rest of loop



    });
    

    setEvents(calendarEvents);

    setSelectedRange({
      from: new Date(dateRange.formattedFromDate),
      to: new Date(dateRange.formattedToDate),
    });

    const earliestDate = getEarliestDate(ticketCalendar);
    setDefaultCalendarDate(earliestDate);
    setCurrentDate(earliestDate);
  }, [ticketCalendar, dispatch]);



  return (
    <div style={{ height: '1500px' }}>

      {/* Render the calendar */}
      {defaultCalendarDate && (
        <Calendar
          localizer={localizer}
          events={events}
          views={['month', 'week', 'day']}
          defaultView="month"

          date={currentDate}                    // Controlled date
          onNavigate={(date) => setCurrentDate(date)}
          tooltipAccessor={(event) =>
            `${event.description || ''}\n${event.sourceType === "TIMELOG"
              ? `${event.timeRange} - ${event.noOfHours || ''} hrs`
              : `${event.dateRange} - ${event.noOfHours || ''} hrs`}`
          }


          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          messages={{
            allDay: 'All Day',
            previous: '<',
            next: '>',
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}

          min={selectedRange?.from}
          max={selectedRange?.to}

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
            return {};
          }}
          eventPropGetter={(event) => {
            let backgroundColor = "#0093DD"; // default

            if (event.sourceType == "TIMELOG") {
              backgroundColor = "#DD8941";
            }

            return {
              style: {
                backgroundColor,
                color: "white",
                borderRadius: "6px",
                padding: "2px",
              },
            };
          }}


          components={{
            event: ({ event }) => (
              <>

                <div className="custom-tooltip" >
                  {event.title}
                </div>
                <div style={{ fontSize: "12px" }}>
                  {event.ticket}
                  {event.sourceType === "TIMELOG" && event.noOfHours
                    ? ` - ${event.noOfHours} hrs`
                    : ""}
                </div>




              </>
            ),


          }}

        />
      )}


    </div>
  );
}
