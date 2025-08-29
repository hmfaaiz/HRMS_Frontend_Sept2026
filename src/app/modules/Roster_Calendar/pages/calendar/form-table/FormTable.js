
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { formatDates } from "../../../../../utils/common";

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
        currentState: state?.roster_calendar,
      };
    }
  );

  const { rosterCalendar, dateRange } = currentState;


  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date(); // fallback
  
    const sorted = [...data].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return new Date(sorted[0].date);
  };
  
  useEffect(() => {


    const calendarEvents = rosterCalendar?.map((roster) => ({
      title: `${roster?.t_employee_roster?.t_employee_profile?.employeeCode} - ${roster?.t_employee_roster?.t_employee_profile?.fullName} (${roster?.t_employee_shift?.name || 'Off Day'})`,
      start: moment(roster?.date).toDate(),
      end: moment(roster?.date).endOf('day').toDate(),
      allDay: true,
      description: `${roster?.t_employee_roster?.t_employee_profile?.employeeCode} - ${roster?.t_employee_roster?.t_employee_profile?.fullName} \n${roster?.t_employee_shift?.name || 'Off Day'}  \n${formatDates(roster?.date, 'dd/MM/yyyy')} \n(${roster?.t_employee_shift?.startTime || '0000'} - ${roster?.t_employee_shift?.endTime || '0000'})`,
      shift: roster?.t_employee_shift?.name || null,
    })


    ) || [];

    setEvents(calendarEvents);
    setSelectedRange({
      from: new Date(dateRange.formattedFromDate),  // Example from date
      to: new Date(dateRange.formattedToDate)
    })



    const earliestDate = getEarliestDate(rosterCalendar);
    setDefaultCalendarDate(earliestDate); 
    setCurrentDate(earliestDate)


  }, [rosterCalendar, dispatch]);

  const isPreviousDisabled = (date) => {
    return date <= selectedRange?.from;
  };

  const isNextDisabled = (date) => {
    return date >= selectedRange?.to;
  };

  return (
    <div style={{ height: '1500px' }}>

      {/* Render the calendar */}
      {defaultCalendarDate  && (
      <Calendar
        localizer={localizer}
        events={events}
          views={['month', 'week', 'day']} // ✅ Agenda ko remove kiya yahan
          defaultView="month"
        tooltipAccessor={(event) => event.description}
        date={currentDate}                    // Controlled date
        onNavigate={(date) => setCurrentDate(date)} 
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
        defaultDate={selectedRange?.from}
        // Optionally, you can customize navigation behavior to stay within range
        components={{
          event: ({ event }) => (
            <div className={`${"custom-tooltip"}`} >
              {event.title}
            </div>
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


          //         className="calendar-btn"
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
          //         className="calendar-btn"
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
