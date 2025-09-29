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
      currentState: state?.team_leave_calender,
    };
  });

  const { leaveCalendar, dateRange } = currentState;

  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date(); // fallback

    const sorted = [...data].sort(
      (a, b) => new Date(a.from) - new Date(b.from)
    );
    return new Date(sorted[0].from);
  };

  // useEffect(() => {
  //   const calendarEvents = [];

  //   (leaveCalendar || []).forEach((leave) => {
  //     const details = leave?.t_leave_application_details || [];

  //     if (details.length === 0) return;

  //     const allCancelled = details.every((d) => d.isCancel === true);

  //     if (allCancelled) return; //

  //     // ✅ Use non-cancelled days only
  //     const validDates = details
  //       .filter((d) => !d.isCancel)
  //       .map((d) => new Date(d.date))
  //       .sort((a, b) => a - b);

  //     if (validDates.length === 0) return;

  //     // ✅ Group consecutive dates together
  //     let group = [validDates[0]];

  //     for (let i = 1; i < validDates.length; i++) {
  //       const prevDate = moment(validDates[i - 1]);
  //       const currentDate = moment(validDates[i]);

  //       if (currentDate.diff(prevDate, "days") === 1) {
  //         group.push(validDates[i]);
  //       } else {
  //         // Create event for the current group
  //         calendarEvents.push({
  //           title: `${leave?.t_employee_profile?.employeeCode} - ${
  //             leave?.t_employee_profile?.fullName
  //           } (${leave?.t_leave_type?.name || "Leave"})`,
  //           start: moment(group[0]).toDate(),
  //           end: moment(group[group.length - 1])
  //             .endOf("day")
  //             .toDate(),
  //           allDay: true,
  //           description: `${leave?.t_employee_profile?.employeeCode} - ${
  //             leave?.t_employee_profile?.fullName
  //           } \n${leave?.t_leave_type?.name || "Leave"} \n${leave?.from} - ${
  //             leave?.to
  //           }`,
  //         });
  //         group = [validDates[i]];
  //       }
  //     }

  //     // Add the last group as event
  //     if (group.length) {
  //       calendarEvents.push({
  //         title: `${leave?.t_employee_profile?.employeeCode} - ${
  //           leave?.t_employee_profile?.fullName
  //         } (${leave?.t_leave_type?.name || "Leave"})`,
  //         start: moment(group[0]).toDate(),
  //         end: moment(group[group.length - 1])
  //           .endOf("day")
  //           .toDate(),
  //         allDay: true,
  //         description: `${leave?.t_employee_profile?.employeeCode} - ${
  //           leave?.t_employee_profile?.fullName
  //         } \n${leave?.t_leave_type?.name || "Leave"} \n${leave?.from} - ${
  //           leave?.to
  //         }`,
  //         request_status: `${leave?.request_status}`,
  //       });
  //     }
  //   });

  //   setEvents(calendarEvents);

  //   setSelectedRange({
  //     from: new Date(dateRange.formattedFromDate),
  //     to: new Date(dateRange.formattedToDate),
  //   });

  //   const earliestDate = getEarliestDate(leaveCalendar);
  //   setDefaultCalendarDate(earliestDate);
  //   setCurrentDate(earliestDate);
  // }, [leaveCalendar, dispatch]);

  useEffect(() => {
    const calendarEvents = [];

    (leaveCalendar || []).forEach((leave) => {
      const details = leave?.t_leave_application_details || [];

      if (details.length === 0) {
        // Direct event using from–to (e.g. Pending status)
        calendarEvents.push({
          title: `${leave?.t_employee_profile?.employeeCode} - ${
            leave?.t_employee_profile?.fullName
          } (${leave?.t_leave_type?.name || "Leave"})`,
          start: moment(leave.from, "DD-MMM-YYYY").toDate(),
          end: moment(leave.to, "DD-MMM-YYYY")
            .endOf("day")
            .toDate(),
          allDay: true,
          description: `${leave?.t_employee_profile?.employeeCode} - ${
            leave?.t_employee_profile?.fullName
          } 
  ${leave?.t_leave_type?.name || "Leave"} 
  ${leave?.from} - ${leave?.to}`,
          request_status: `${leave?.request_status}`,
        });
        return; // skip rest of loop
      }

      // Ignore fully cancelled leaves
      const allCancelled = details.every((d) => d.isCancel === true);
      if (allCancelled) return;

      // Use non-cancelled days only
      const validDates = details
        .filter((d) => !d.isCancel)
        .map((d) => new Date(d.date))
        .sort((a, b) => a - b);

      if (validDates.length === 0) return;

      // Group consecutive dates
      let group = [validDates[0]];
      for (let i = 1; i < validDates.length; i++) {
        const prevDate = moment(validDates[i - 1]);
        const currentDate = moment(validDates[i]);

        if (currentDate.diff(prevDate, "days") === 1) {
          group.push(validDates[i]);
        } else {
          calendarEvents.push({
            title: `${leave?.t_employee_profile?.employeeCode} - ${
              leave?.t_employee_profile?.fullName
            } (${leave?.t_leave_type?.name || "Leave"})`,
            start: moment(group[0]).toDate(),
            end: moment(group[group.length - 1])
              .endOf("day")
              .toDate(),
            allDay: true,
            description: `${leave?.t_employee_profile?.employeeCode} - ${
              leave?.t_employee_profile?.fullName
            } 
  ${leave?.t_leave_type?.name || "Leave"} 
  ${leave?.from} - ${leave?.to}`,
            request_status: `${leave?.request_status}`,
          });
          group = [validDates[i]];
        }
      }

      // Add last group
      if (group.length) {
        calendarEvents.push({
          title: `${leave?.t_employee_profile?.employeeCode} - ${
            leave?.t_employee_profile?.fullName
          } (${leave?.t_leave_type?.name || "Leave"})`,
          start: moment(group[0]).toDate(),
          end: moment(group[group.length - 1])
            .endOf("day")
            .toDate(),
          allDay: true,
          description: `${leave?.t_employee_profile?.employeeCode} - ${
            leave?.t_employee_profile?.fullName
          } 
  ${leave?.t_leave_type?.name || "Leave"} 
  ${leave?.from} - ${leave?.to}`,
          request_status: `${leave?.request_status}`,
        });
      }
    });

    setEvents(calendarEvents);

    setSelectedRange({
      from: new Date(dateRange.formattedFromDate),
      to: new Date(dateRange.formattedToDate),
    });

    const earliestDate = getEarliestDate(leaveCalendar);
    setDefaultCalendarDate(earliestDate);
    setCurrentDate(earliestDate);
  }, [leaveCalendar, dispatch]);

  return (
    <div style={{ height: "800px" }}>
      {/* Render the calendar */}
      {defaultCalendarDate && (
        <Calendar
          localizer={localizer}
          events={events}
          views={["month", "week", "day"]} // ✅ Agenda ko remove kiya yahan
          defaultView="month"
          // date={defaultCalendarDate}
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
          min={selectedRange?.from}
          max={selectedRange?.to}
          // Optionally, you can customize navigation behavior to stay within range
          components={{
            event: ({ event }) => (
              <div className="custom-tooltip">{event.title}</div>
            ),
            // toolbar: (props) => (
            //   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            //     <div style={{ display: 'flex', alignItems: 'center' }}>

            //       <button
            //         disabled={isPreviousDisabled(props.date)}  // Disable if at the start date
            //         onClick={() => {
            //           if (!isPreviousDisabled(props.date)) {
            //             props.onNavigate('PREV');  // Navigate to the previous date
            //           }
            //         }}

            //          className="calendar-btn"
            //       >
            //         {"<"}
            //       </button>
            //       {/* Next Button */}
            //       <button
            //         disabled={isNextDisabled(props.date)}  // Disable if at the end date
            //         onClick={() => {
            //           if (!isNextDisabled(props.date)) {
            //             props.onNavigate('NEXT');  // Navigate to the next date
            //           }
            //         }}
            //        className="calendar-btn"
            //       >
            //         {">"}
            //       </button>
            //     </div>

            //     {/* Month/Week/Day/Agenda View Selector */}

            //     {/* Display the current month/year */}
            //     <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            //       {moment(props.date).format('MMMM YYYY')}
            //     </div>
            //   </div>
            // ),
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

            return {};
          }}
          eventPropGetter={(event) => {
            let backgroundColor = "#0093DD"; // default

            if (event.request_status == "P") {
              backgroundColor = "hsl(62, 78%, 41%)"; // Approved -> Yellow
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
        />
      )}
    </div>
  );
}
