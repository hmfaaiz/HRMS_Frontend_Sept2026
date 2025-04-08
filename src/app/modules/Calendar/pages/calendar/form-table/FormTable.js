
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
        currentState: state.calendar,
      };
    }
  );

  const { holidayCalendar,dateRange } = currentState;



  useEffect(() => {


    const calendarEvents = holidayCalendar?.map((holiday) => ({
      title: holiday.name,
      start: moment(holiday.from_date).toDate(),
      end: moment(holiday.to_date).toDate(),
      allDay: true,
    })
  
  
  ) || [];

    setEvents(calendarEvents);
    setSelectedRange({ from_date: new Date(dateRange.formattedFromDate),  // Example from date
    to_date: new Date(dateRange.formattedToDate)}) 
   
  
  
  
  
  
  }, [holidayCalendar, dispatch]);

  const isPreviousDisabled = (date) => {
    return date <= selectedRange?.from_date;
  };

  const isNextDisabled = (date) => {
    return date >= selectedRange?.to_date;
  };

  return (
    <div style={{ height: '600px' }}>

      {/* Render the calendar */}
      <Calendar
        localizer={localizer}
        events={events}
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

        min={selectedRange?.from_date}
        max={selectedRange?.to_date}
        defaultDate={selectedRange?.from_date}
        // Optionally, you can customize navigation behavior to stay within range
        components={{
          toolbar: (props) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
             
                <button
                  disabled={isPreviousDisabled(props.date)}  // Disable if at the start date
                  onClick={() => {
                    if (!isPreviousDisabled(props.date)) {
                      props.onNavigate('PREV');  // Navigate to the previous date
                    }
                  }}
                  

                   className="calendar-btn"
                >
                  {"<"}
                </button>
                {/* Next Button */}
                <button
                  disabled={isNextDisabled(props.date)}  // Disable if at the end date
                  onClick={() => {
                    if (!isNextDisabled(props.date)) {
                      props.onNavigate('NEXT');  // Navigate to the next date
                    }
                  }}
                 className="calendar-btn"
                >
                  {">"}
                </button>
              </div>

              {/* Month/Week/Day/Agenda View Selector */}
             

              {/* Display the current month/year */}
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {moment(props.date).format('MMMM YYYY')}
              </div>
            </div>
          ),

        }}
      />



    </div>
  );
}
