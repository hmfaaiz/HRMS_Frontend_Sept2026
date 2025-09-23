
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
    "Leave": "tooltip-Leave",
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
          let className = '';
        
          if (event.color_key && statusMap[event.color_key]) {
         
            className = statusMap[event.color_key];
          }
          else if (event.color_key.toLowerCase().includes("leave")) {
          
            className = statusMap["Leave"];
          }
          else{
            className="tooltip-absent-att"
          }
        
          return { className };
        }}



     
      />

      )}

    </div>
  );
}
