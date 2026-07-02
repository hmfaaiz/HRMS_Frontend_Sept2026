
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";

const localizer = momentLocalizer(moment);

export function FormTable() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedRange, setSelectedRange] = useState();
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [currentView, setCurrentView] = useState("month");



  const { currentState } = useSelector(
    (state) => {

      return {
        currentState: state?.portal_ticket_calendar,
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

  const truncate = (text, max = 9) => {
    if (!text) return "";
    if (currentView === "month") {
      return text.length > max ? text.slice(0, max) + ".." : text;
    }
    return text; // day/week view me full text
  };



  useEffect(() => {
    const calendarEvents = [];

    (ticketCalendar || []).forEach((data) => {

      calendarEvents.push({
        name: data.sourceType === "FACILITATOR"
          ? `${data?.EmployeeProfileReceive?.employeeCode || data?.EmployeeProfile?.employeeCode || ""} - ${data?.EmployeeProfileReceive?.fullNameReceive || data?.EmployeeProfile?.fullName || ""}`

          : data.sourceType === "TICKET"
            ? `${data?.AssignToEmp?.employeeCode} - ${data?.AssignToEmp?.fullName}`
            : data.sourceType === "TIMELOG"
              ? `${data.isFromTimeLogging ? data?.Employee?.employeeCode : data?.LoggedByProfile?.employeeCode} - ${data.isFromTimeLogging ? data?.Employee?.fullName : data?.LoggedByProfile?.fullName}`
              : "Unknown", // fallback if sourceType doesn't match

        start: moment(data.from, "DD-MMM-YYYY").toDate(),
        end: moment(data.to, "DD-MMM-YYYY").endOf("day").toDate(),
        allDay: true,
        // description: data.sourceType === "FACILITATOR"
        //   ? data?.ticketDescription
        //   : data.sourceType === "TICKET"
        //     ? data?.ticketSummary
        //     : data.sourceType === "TIMELOG"
        //       ? data?.workDescription
        //       : "",
        ticketStatus: data?.ticketStatus,
        sourceType: data.sourceType,
        timeRange: `${data?.timeRangeFrom} - ${data?.timeRangeTo}`,
        dateRange: `${data?.from} - ${data?.to}`,
        noOfHours: `${data?.noOfHours}`,
        profileImage: data.sourceType === "FACILITATOR"
          ? `${data?.EmployeeProfileReceive?.profile_image || data?.EmployeeProfile?.profile_image || ""} `

          : data.sourceType === "TICKET"
            ? `${data?.AssignToEmp?.profile_image}`
            : data.sourceType === "TIMELOG"
              ? `${data.isFromTimeLogging ? data?.Employee?.profile_image : data?.LoggedByProfile?.profile_image}`
              : "Unknown", // fallback if sourceType doesn't match
        title:
          data.sourceType === "TIMELOG"
            ? data?.MasterDetailTimeLog
              ? <>
                {data?.MasterDetailTimeLog?.ticketCode} {data?.MasterDetailTimeLog?.ticketDescription ? "-" : ""} {truncate(data?.MasterDetailTimeLog?.ticketDescription)}
              </>
              :
              data?.Ticket
                ? <>
                  {data?.Ticket?.ticketCode} {data?.Ticket?.ticketDescription ? "-" : ""} {truncate(data?.Ticket?.ticketDescription)}

                </>
                :

                "No Ticket Linked"
            : <>
              {data?.ticketCode} {data?.ticketDescription ? "-" : ""} {truncate(data?.ticketDescription)}
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
  }, [ticketCalendar, dispatch, currentView]);



  return (
    <div style={{ height: '500px' }}>
      {/* Render the calendar */}
      {defaultCalendarDate && (
        <Calendar

          localizer={localizer}
          events={events}
          views={['month', 'week', 'day']}
          defaultView="week"
          onView={(view) => setCurrentView(view)}
          date={currentDate}                    // Controlled date
          onNavigate={(date) => setCurrentDate(date)}
          tooltipAccessor={(event) =>
            `${event.description || ''}\n${event.sourceType === "TIMELOG"
              ? `${event.name} : ${event.timeRange} - ${event.noOfHours || ''} hrs`
              : `${event.name} ${event.dateRange} - ${event.noOfHours || ''} hrs`}`
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
                  padding: "2px",

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
                height: "65%",
              },
            };
          }}


          components={{
            event: ({ event }) => (
              <>

                <div className="custom-tooltip"  >
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>


                    {/* {event?.ticketStatus == 0 && (
                      <div style={{ display: "flex", alignItems: "center", }}>
                        <div
                        className="w-[10px] h-[10px] rounded-full bg-[#39FF14]"
                        ></div>

                      </div>
                    )} */}
                    {event?.ticketStatus == 0 ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="w-[10px] h-[10px] rounded-full bg-[#39FF14]"></div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="w-[10px] h-[10px] rounded-full bg-[#eb052b]"></div>
                      </div>
                    )}
                    {event.title}  {event.profileImage && (
                      <img
                        src={event.profileImage}
                        alt="Profile"
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                  </div>
                </div>




              </>
            ),


          }}

        />
      )}


    </div>
  );
}
