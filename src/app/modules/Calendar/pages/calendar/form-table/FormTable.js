// import React, { useEffect, useMemo } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory, {
//   PaginationProvider,
// } from "react-bootstrap-table2-paginator";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import * as actions from "../../../_redux/redux-Actions";
// import {
//   getHandlerTableChange,
//   NoRecordsFoundMessage,
//   PleaseWaitMessage,
//   sortCaret,
//   headerSortingClasses,
// } from "../../../../../../_metronic/_helpers";
// import * as uiHelpers from "../FormUIHelpers";
// import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
// import { Pagination } from "../../../../../../_metronic/_partials/controls";
// import { useFormUIContext } from "../FormUIContext";

// export function FormTable() {
//   //Users UI Context
//   const formUIContext = useFormUIContext();

//   const formUIProps = useMemo(() => {
//     return {
//       ids: formUIContext.ids,
//       setIds: formUIContext.setIds,
//       queryParams: formUIContext.queryParams,
//       setQueryParams: formUIContext.setQueryParams,
//       openEditFormDialog: formUIContext.openEditFormDialog,
//       openDeleteFormDialog: formUIContext.openDeleteFormDialog,
//       openActiveFormDialog: formUIContext.openActiveFormDialog,
//       openReadFormDialog: formUIContext.openReadFormDialog,
//     };
//   }, [formUIContext]);


//   const { currentState, userAccess } = useSelector(
//     (state) => {
//       return {


//         currentState: state.holidays,
//         userAccess: state?.auth?.userAccess["holidays"],
//       }
//     },
//     shallowEqual
//   );


//   const { totalCount, entities, listLoading } = currentState;

//   //totalCount = 10

//   const dispatch = useDispatch();

//   useEffect(() => {
//     formUIProps.setIds([]);

//     dispatch(actions.fetchHolidays(formUIProps.queryParams));
//   }, [formUIProps.queryParams, dispatch, totalCount]);


//   // Table columns
//   const columns = [

//     {
//       dataField: "Subsidiary.name",
//       text: "Subsidiary",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "160px",
//       },
//     },
//     {
//       dataField: "name",
//       text: "Holiday",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "160px",
//       },
//     },
//     {
//       dataField: "from_date",
//       text: "from date",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       // style: {
//       //   minWidth: "10px",
//       //   textAlign: "center",
//       // },
//       // headerStyle: {
//       //   textAlign: "center", // Align header text to the left
//       // },
//     },


//     {
//       dataField: "to_date",
//       text: "to date",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "10px",
//       },
//     },

//     {
//       dataField: "action",
//       text: "Actions",
//       isDummyField: true,
//       formatter: ActionsColumnFormatter,
//       formatExtraData: {
//         openEditFormDialog: formUIProps.openEditFormDialog,
//         openDeleteFormDialog: formUIProps.openDeleteFormDialog,
//         openActiveFormDialog: formUIProps.openActiveFormDialog,
//         openReadFormDialog: formUIProps.openReadFormDialog,
//         isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
//         isAccessForDelete: isAccessForDelete
//           ? isAccessForDelete.isAccess
//           : false,
//       },
//       classes: "text-right pr-0",
//       headerClasses: "text-right pr-3",
//       style: {
//         minWidth: "10px",
//       },
//     },
//   ];

//   //Table pagination properties
//   const paginationOptions = {
//     custom: true,
//     totalSize: totalCount,
//     sizePerPageList: uiHelpers.sizePerPageList,
//     sizePerPage: formUIProps.queryParams.pageSize,
//     page: formUIProps.queryParams.pageNumber,
//   };

//   return (
//     <>
//       <PaginationProvider pagination={paginationFactory(paginationOptions)}>
//         {({ paginationProps, paginationTableProps }) => {
//           return (
//             <Pagination
//               isLoading={listLoading}
//               paginationProps={paginationProps}
//             >
//               <BootstrapTable
//                 wrapperClasses="table-responsive"
//                 bordered={false}
//                 classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
//                 bootstrap4
//                 remote
//                 keyField="Id"
//                 data={entities === null ? [] : entities}
//                 columns={columns}
//                 defaultSorted={uiHelpers.defaultSorted}
//                 onTableChange={getHandlerTableChange(
//                   formUIProps.setQueryParams
//                 )}
//                 // selectRow={getSelectRow({
//                 //   entities,

//                 // })}
//                 {...paginationTableProps}
//               >
//                 <PleaseWaitMessage entities={entities} />
//                 <NoRecordsFoundMessage entities={entities} />
//               </BootstrapTable>
//             </Pagination>
//           );
//         }}
//       </PaginationProvider>
//     </>
//   );
// }


// import React, { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import * as actions from "../../../_redux/redux-Actions";
// import { useFormUIContext } from "../FormUIContext";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { Modal } from "react-bootstrap";

// export function FormTable() {
//   const formUIContext = useFormUIContext();

//   const formUIProps = useMemo(() => {
//     return {
//       ids: formUIContext.ids,
//       setIds: formUIContext.setIds,
//       queryParams: formUIContext.queryParams,
//       setQueryParams: formUIContext.setQueryParams,
//       openEditFormDialog: formUIContext.openEditFormDialog,
//       openDeleteFormDialog: formUIContext.openDeleteFormDialog,
//       openActiveFormDialog: formUIContext.openActiveFormDialog,
//       openReadFormDialog: formUIContext.openReadFormDialog,
//     };
//   }, [formUIContext]);

//   const { currentState, userAccess } = useSelector(
//     (state) => ({
//       currentState: state.holidays,
//       userAccess: state?.auth?.userAccess["holidays"],
//     })
//   );

//   const { totalCount, entities, listLoading } = currentState;
//   const dispatch = useDispatch();

//   useEffect(() => {
//     formUIProps.setIds([]);
//     dispatch(actions.fetchHolidays(formUIProps.queryParams));
//   }, [formUIProps.queryParams, dispatch]);

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [showHolidayDetails, setShowHolidayDetails] = useState(null); // to show details in modal

//   // Function to handle date selection from the calendar
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   // Function to handle clicking on a holiday
//   const handleHolidayClick = (holiday) => {
//     setShowHolidayDetails(holiday);
//   };

//   const handleCloseModal = () => {
//     setShowHolidayDetails(null); // Close the modal
//   };

//   const isAccessForEdit = userAccess?.find(
//     (item) => item.componentName === "UpdateHolidays"
//   );

//   const isAccessForDelete = userAccess?.find(
//     (item) => item.componentName === "DeleteHolidays"
//   );

//   // Convert holidays data to a format suitable for the calendar
//   const holidayEvents = entities?.map((holiday) => ({
//     title: holiday.name,
//     startDate: new Date(holiday.from_date),
//     endDate: new Date(holiday.to_date),
//     holidayId: holiday.id,
//   }));

//   return (
//     <div>
//       {/* Calendar */}
//       <Calendar
//         onChange={handleDateChange}
//         value={selectedDate}
//         tileContent={({ date, view }) => {
//           // Render holiday events as "dots" on the calendar day
//           const holidayForDate = holidayEvents?.find(
//             (event) =>
//               date >= event.startDate && date <= event.endDate
//           );
//           return holidayForDate ? (
//             <div className="holiday-dot" />
//           ) : null;
//         }}
//       />

//       {/* Modal to display holiday details */}
//       {showHolidayDetails && (
//         <Modal
//           isOpen={true}
//           onClose={handleCloseModal}
//           title={`Holiday: ${showHolidayDetails.name}`}
//         >
//           <div>
//             <p>From: {showHolidayDetails.from_date}</p>
//             <p>To: {showHolidayDetails.to_date}</p>
//             {/* Add buttons for editing or deleting holidays */}
//             {isAccessForEdit && (
//               <button
//                 onClick={() =>
//                   formUIProps.openEditFormDialog(showHolidayDetails)
//                 }
//               >
//                 Edit
//               </button>
//             )}
//             {isAccessForDelete && (
//               <button
//                 onClick={() =>
//                   formUIProps.openDeleteFormDialog(showHolidayDetails)
//                 }
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { PleaseWaitMessage, NoRecordsFoundMessage } from "../../../../../../_metronic/_helpers";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
const localizer = momentLocalizer(moment);

export function FormTable() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);

  // Users UI Context
  // const formUIContext = useMemo(() => {

  //   return {
  //     queryParams: formUIContext.queryParams,
  // setQueryParams: formUIContext.setQueryParams,
  //   };
  // }, [formUIContext]);

  const { currentState } = useSelector(
    (state) => {
      return {
        currentState: state.holidays,
      };
    }
  );

  const { totalCount, entities, listLoading } = currentState;

  useEffect(() => {
    dispatch(actions.fetchHolidays());
  }, [, dispatch]);

  useEffect(() => {
    // Map the holiday data to the format required by the calendar component
    const calendarEvents = entities?.map((holiday) => ({
      title: holiday.name, // Title of the event
      start: moment(holiday.from_date).toDate(), // Convert from_date to JavaScript Date object
      end: moment(holiday.to_date).toDate(), // Convert to_date to JavaScript Date object
      allDay: true, // Mark the event as all-day
    })) || [];

    setEvents(calendarEvents);
  }, [entities]);

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
            />
         

  
    </div>
  );
}
