
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
        currentState: state?.attendance_calendar,
      };
    }
  );

  const { attendanceCalendar, dateRange } = currentState;


  const getEarliestDate = (data) => {
    if (!data || data.length === 0) return new Date(); // fallback
  
    const sorted = [...data].sort(
      (a, b) => new Date(a.AttDate) - new Date(b.AttDate)
    );
    return new Date(sorted[0].AttDate);
  };
  

  const statusMap = {
    "Absent (Shift is yet to start)": "tooltip-absent-att",
    "Absent (Off Day)": "tooltip-absent-att",
    "Absent (Holiday)": "tooltip-absent-att",
    "Absent": "tooltip-absent-att",
    "H.D('LeaveCode') + H.D(A)": "tooltip-HD",
    "H.D(P) + H.D(A)": "tooltip-HD",
    "H.D(P) + H.D('LeaveCode')": "tooltip-HD",
    "Holiday (H.D(Present))": "tooltip-HD",
    "Day Off (H.D(Present))": "tooltip-HD",
    "LeaveCode": "",
    "Holiday (Present)": "tooltip-dayoff",
    "Day Off (Present)": "tooltip-dayoff",
    "Day Off": "tooltip-dayoff",
    "Holiday": "tooltip-dayoff",
    "Present": "tooltip-present",
    "Present (On-Time)": "tooltip-present",
    "Present (On Time, Early-Out)": "tooltip-presents",
    "Present (Early Out)": "tooltip-presents",
    "Present (Late-In)(Holiday)": "tooltip-presents",
    "Present (Late-In)(Day Off)": "tooltip-presents",
    "Present (Late-In, Early-Out)": "tooltip-presents",
    "Present (Late-In)": "tooltip-presents"
  };


  useEffect(() => {
    const calendarEvents = attendanceCalendar?.map((attendance) => ({
      title: `${attendance.EmployeeCode} - ${attendance?.FullName} (${attendance?.shiftDescription})`,
      start: moment(attendance?.AttDate).toDate(),
      end: moment(attendance?.AttDate).endOf('day').toDate(),
      allDay: true,
      description: `${attendance.EmployeeCode} - ${attendance?.FullName} \n${attendance?.AttendanceStatus|| 'Status --'} \n${formatDates(attendance?.AttDate, 'dd/MM/yyyy')}  (${attendance?.TimeIn || '0000'} - ${attendance?.TimeOut || '0000'}) `,
      color_key:`${attendance?.AttendanceStatus}`
    
    })


    ) || [];

    setEvents(calendarEvents);

    setSelectedRange({
      from: new Date(dateRange.formattedFromDate),  // Example from date
      to: new Date(dateRange.formattedToDate)
    })

    //for starting date 
// setDefaultCalendarDate(new Date(dateRange.formattedFromDate));


const earliestAttendanceDate = getEarliestDate(attendanceCalendar);
  setDefaultCalendarDate(earliestAttendanceDate); 
  setCurrentDate(earliestAttendanceDate)
  }, [attendanceCalendar, dispatch]);


  //fot time being it is not in use
  const isPreviousDisabled = (date) => {
    return date <= selectedRange?.from;
  };

  const isNextDisabled = (date) => {
    return date >= selectedRange?.to;
  };

  return (
    <div style={{ height: '1550px' }}>

      {/* Render the calendar */}

      {defaultCalendarDate && (
      <Calendar
        localizer={localizer}
        events={events}
         views={['month', 'week', 'day']} // ✅ Agenda ko remove kiya yahan
          defaultView="month"
          // defaultDate={defaultCalendarDate}
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

        min={selectedRange?.from}
        max={selectedRange?.to}
        // defaultDate={selectedRange?.from}
      
       
        components={{
          event: ({ event }) => (
            <div className="custom-tooltip"
             
            >
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
        // eventPropGetter={(event) => {
        //   if (!attendance?.AttendanceStatus) {  
        //     return {
        //       className: 'tooltip-absent'
        //     };
        //   }
        //   return {};
        // }}


        eventPropGetter={(event) => {
          let className = '';
        
          if (event.color_key && statusMap[event.color_key]) {
            console.log("COLORING",statusMap[event.color_key])
            className = statusMap[event.color_key];
          }else{
            className="tooltip-absent-att"
          }
        
          return { className };
        }}



        // eventPropGetter={(event) => {
        //   let className = '';
        
        //   if (event.description) {
        //     if (event.description.includes('Absent')) {
        //       console.log("absent111")
        //       className = 'tooltip-absent1';
        //     } 
        //     else if (event.description.includes('Present')) {
        //       className = 'tooltip-present';
        //     } else if (event.description.includes('Holiday')) {
        //       className = 'tooltip-holiday';
        //     } else if (event.description.includes('Day Off')) {
        //       className = 'tooltip-dayofff';
        //     }
        //   }
        
        //   return { className };
        // }}
      />

      )}

    </div>
  );
}
