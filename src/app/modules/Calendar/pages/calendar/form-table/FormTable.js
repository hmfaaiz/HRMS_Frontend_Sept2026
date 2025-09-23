
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
        currentState: state.calendar,
      };
    }
  );

  const { holidayCalendar,dateRange } = currentState;

  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date(); // fallback
  
    const sorted = [...data].sort(
      (a, b) => new Date(a.from_date) - new Date(b.from_date)
    );
    return new Date(sorted[0].from_date);
  };
  

  useEffect(() => {


    const calendarEvents = holidayCalendar?.map((holiday) => ({
      title: holiday?.name,
      start: moment(holiday?.from_date).toDate(),
      end: moment(holiday?.to_date).endOf('day').toDate(),
      allDay: true,
      description: `${holiday?.name}  \n${holiday?.from_date} - ${holiday?.to_date} `,
    })
  
    
  
  ) || [];

    setEvents(calendarEvents);
    setSelectedRange({ from_date: new Date(dateRange.formattedFromDate),  // Example from date
    to_date: new Date(dateRange.formattedToDate)}) 
   
  
  
  
    const earliestDate = getEarliestDate(holidayCalendar);
    setDefaultCalendarDate(earliestDate); 
    setCurrentDate(earliestDate)
  
  }, [holidayCalendar, dispatch]);

  const isPreviousDisabled = (date) => {
    return date <= selectedRange?.from_date;
  };

  const isNextDisabled = (date) => {
    return date >= selectedRange?.to_date;
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
          date={currentDate}                    // Controlled date
          onNavigate={(date) => setCurrentDate(date)} 
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

        min={selectedRange?.from_date}
        max={selectedRange?.to_date}
        defaultDate={selectedRange?.from_date}
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
      )}


    </div>
  );
}
