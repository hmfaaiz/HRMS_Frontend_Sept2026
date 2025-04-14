
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





  const { currentState } = useSelector(
    (state) => {
      
      return {
        currentState: state?.leave_calendar,
      };
    }
  );

  const { leaveCalendar,dateRange } = currentState;



  useEffect(() => {


    const calendarEvents = leaveCalendar?.map((leave) => ({
      title: `${leave?.t_employee_profile?.employeeCode} - ${leave?.t_employee_profile?.fullName} (${leave?.t_leave_type?.name || 'Leave'})`,
      start: moment(leave?.from).toDate(),
      end: moment(leave?.to).endOf('day').toDate(),
      allDay: true,
      description: `${leave?.t_employee_profile?.employeeCode} - ${leave?.t_employee_profile?.fullName} \n${leave?.t_leave_type?.name || 'Leave'} \n${leave?.from} - ${leave?.to} `,
    })
  
  
  ) || [];

    setEvents(calendarEvents);
    setSelectedRange({ from: new Date(dateRange.formattedFromDate),  // Example from date
    to: new Date(dateRange.formattedToDate)}) 
   
  
  
  
  
  
  }, [leaveCalendar, dispatch]);

  const isPreviousDisabled = (date) => {
    return date <= selectedRange?.from;
  };

  const isNextDisabled = (date) => {
    return date >= selectedRange?.to;
  };

  return (
    <div style={{ height: '1500px' }}>

      {/* Render the calendar */}
      <Calendar
        localizer={localizer}
        events={events}
          views={['month', 'week', 'day']} // ✅ Agenda ko remove kiya yahan
          defaultView="month"
        tooltipAccessor={(event) => event.description}
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
            <div className="custom-tooltip" >
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
      />



    </div>
  );
}
