// // import React, { useEffect, useMemo } from "react";
// // import BootstrapTable from "react-bootstrap-table-next";
// // import paginationFactory, {
// //   PaginationProvider,
// // } from "react-bootstrap-table2-paginator";
// // import { shallowEqual, useDispatch, useSelector } from "react-redux";
// // import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
// // import * as actions from "../../../_redux/redux-Actions";
// // import {
// //   getHandlerTableChange,
// //   NoRecordsFoundMessage,
// //   PleaseWaitMessage,
// //   sortCaret,
// //   headerSortingClasses,
// // } from "../../../../../../_metronic/_helpers";
// // import { Pagination } from "../../../../../../_metronic/_partials/controls";
// // import { formatDates, format } from "../../../../../utils/common";

// // export function FormTable({ ticketStatuses, ticketTypes, priorityLevels }) {
// //   const uiContext = useTaskAssignmentTimelineUIContext();
// //   const dispatch = useDispatch();

// //   const uiProps = useMemo(() => {
// //     return {
// //       ids: uiContext.ids,
// //       setIds: uiContext.setIds,
// //       queryParams: uiContext.queryParams,
// //       setQueryParams: uiContext.setQueryParams,
// //     };
// //   }, [uiContext]);

// //   const { currentState, allEmployees } = useSelector(
// //     (state) => ({
// //       currentState: state.task_assignment_timeline,
// //       allEmployees: state.dashboard?.allEmployees || [],
// //     }),
// //     shallowEqual
// //   );

// //   useEffect(() => {
// //     // Fetch task assignment timeline data based on queryParams
// //     dispatch(actions.fetchTaskAssignmentTimeline(uiProps.queryParams));
// //   }, [dispatch, uiProps.queryParams]);

// //   const { entities, totalCount, listLoading } = currentState || {};

// //   // Helper functions
// //   const getEmployeeName = (employeeId) => {
// //     const employee = allEmployees.find((emp) => emp.value === employeeId);
// //     return employee ? employee.label : "N/A";
// //   };

// //   const getTicketTypeName = (ticketTypeId) => {
// //     const ticketType = ticketTypes.find((type) => type.value === ticketTypeId);
// //     return ticketType ? ticketType.label : "N/A";
// //   };

// //   const getTicketStatusName = (ticketStatusId) => {
// //     const status = ticketStatuses.find((s) => s.value === ticketStatusId);
// //     return status ? status.label : "N/A";
// //   };

// //   const getPriorityLevelName = (priorityLevelId) => {
// //     const priority = priorityLevels.find((p) => p.value === priorityLevelId);
// //     return priority ? priority.label : "N/A";
// //   };

// //   const getPriorityColor = (priorityLevelId) => {
// //     const priority = priorityLevels.find((p) => p.value === priorityLevelId);
// //     return priority?.color || "#808080";
// //   };

// //   // Ticket status options
// //   const ticketStatusOptions = [
// //     { value: 1, label: "Open" },
// //     { value: 0, label: "Completed" },
// //     { value: 3, label: "Re-opened" },
// //     { value: 2, label: "Send for Review" },
// //   ];

// //   // Table columns
// //   const columns = [
// //     {
// //       dataField: "Id",
// //       text: "ID",
// //       sort: true,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       hidden: true,
// //     },
// //     {
// //       dataField: "priorityLevelId",
// //       text: "",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "5px",
// //       },
// //       formatter: (cell, row) => {
// //         const color = getPriorityColor(cell);
// //         return (
// //           <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
// //             <span
// //               style={{
// //                 width: "10px",
// //                 height: "10px",
// //                 borderRadius: "50%",
// //                 backgroundColor: color,
// //                 display: "inline-block",
// //               }}
// //             ></span>
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       dataField: "ticketCode",
// //       text: "Ticket Code",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "30px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "ticketTypeId",
// //       text: "Ticket Type",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "30px",
// //       },
// //       formatter: (cell) => {
// //         const displayText = getTicketTypeName(cell);
// //         if (!displayText) return "";
// //         return displayText.length > 30 ? (
// //           <span title={displayText}>{displayText.substring(0, 70) + "..."}</span>
// //         ) : (
// //           displayText
// //         );
// //       },
// //     },
// //     {
// //       dataField: "priorityLevelId",
// //       text: "Priority",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "30px",
// //       },
// //       formatter: (cell) => {
// //         const displayText = getPriorityLevelName(cell);
// //         if (!displayText) return "";
// //         return displayText.length > 30 ? (
// //           <span title={displayText}>{displayText.substring(0, 70) + "..."}</span>
// //         ) : (
// //           displayText
// //         );
// //       },
// //     },
// //     {
// //       dataField: "ticketDescription",
// //       text: "Ticket Description",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "70px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "assignTo",
// //       text: "Assign To",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "100px",
// //       },
// //       formatter: (cell) => {
// //         const displayText = getEmployeeName(cell);
// //         if (!displayText) return "";
// //         return displayText.length > 30 ? (
// //           <span title={displayText}>{displayText.substring(0, 70) + "..."}</span>
// //         ) : (
// //           displayText
// //         );
// //       },
// //     },
// //     {
// //       dataField: "AssignToProfile.department.deptName",
// //       text: "Department",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "100px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "AssignToProfile.designation.formName",
// //       text: "Designation",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "100px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "dueDate",
// //       text: "Due Date",
// //       sort: true,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "30px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";

// //         const dueDate = new Date(cell);
// //         const today = new Date();

// //         // Reset time (compare only the date)
// //         dueDate.setHours(0, 0, 0, 0);
// //         today.setHours(0, 0, 0, 0);

// //         const isExpiredOrToday = dueDate <= today;

// //         return (
// //           <span
// //             style={{
// //               color: isExpiredOrToday ? "red" : "inherit",
// //               fontWeight: isExpiredOrToday ? "600" : "normal",
// //             }}
// //           >
// //             {formatDates(cell)}
// //           </span>
// //         );
// //       },
// //     },
// //     {
// //       dataField: "timeRangeFrom",
// //       text: "From Time",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "70px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "timeRangeTo",
// //       text: "To Time",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "70px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";
// //         return cell.length > 30 ? (
// //           <span title={cell}>{cell.substring(0, 70) + "..."}</span>
// //         ) : (
// //           cell
// //         );
// //       },
// //     },
// //     {
// //       dataField: "noOfHours",
// //       text: "No Of Hours",
// //       sort: true,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "70px",
// //       },
// //       formatter: (cell) => cell || 0,
// //     },
// //     {
// //       dataField: "ticketStatus",
// //       text: "Status",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "30px",
// //       },
// //       formatter: (cell) => {
// //         if (cell === null || cell === undefined) return "";

// //         const status = ticketStatusOptions.find((opt) => opt.value === cell);
// //         const displayText = status ? status.label : cell;

// //         return displayText.length > 30 ? (
// //           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
// //         ) : (
// //           displayText
// //         );
// //       },
// //     },
// //     {
// //       dataField: "dueDate",
// //       text: "",
// //       sort: false,
// //       sortCaret: sortCaret,
// //       headerSortingClasses,
// //       style: {
// //         minWidth: "10px",
// //       },
// //       formatter: (cell) => {
// //         if (!cell) return "";

// //         const dueDate = new Date(cell);
// //         const today = new Date();

// //         // Reset time (compare only the date)
// //         dueDate.setHours(0, 0, 0, 0);
// //         today.setHours(0, 0, 0, 0);

// //         const isExpiredOrToday = dueDate <= today;

// //         return (
// //           <>
// //             {isExpiredOrToday && (
// //               <span style={{ color: "red", fontWeight: 600, marginLeft: "5px" }}>
// //                 Over Due
// //               </span>
// //             )}
// //           </>
// //         );
// //       },
// //     },
// //   ];

// //   // Table pagination options
// //   const paginationOptions = {
// //     custom: true,
// //     totalSize: totalCount || 0,
// //     sizePerPageList: [
// //       { text: "10", value: 10 },
// //       { text: "20", value: 20 },
// //       { text: "50", value: 50 },
// //       { text: "100", value: 100 },
// //     ],
// //     sizePerPage: uiProps.queryParams.pageSize,
// //     page: uiProps.queryParams.pageNumber,
// //   };

// //   return (
// //     <div className="w-full overflow-x-auto">
// //       <PaginationProvider pagination={paginationFactory(paginationOptions)}>
// //         {({ paginationProps, paginationTableProps }) => {
// //           return (
// //             <Pagination
// //               isLoading={listLoading}
// //               paginationProps={paginationProps}
// //             >
// //               <BootstrapTable
// //                 wrapperClasses="table-responsive"
// //                 bordered={false}
// //                 classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
// //                 bootstrap4
// //                 remote
// //                 keyField="Id"
// //                 data={entities === null ? [] : entities}
// //                 columns={columns}
// //                 defaultSorted={[{ dataField: "Id", order: "desc" }]}
// //                 onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
// //                 {...paginationTableProps}
// //               >
// //                 <PleaseWaitMessage entities={entities} />
// //                 <NoRecordsFoundMessage entities={entities} />
// //               </BootstrapTable>
// //             </Pagination>
// //           );
// //         }}
// //       </PaginationProvider>
// //     </div>
// //   );
// // }



// import React, { useEffect, useMemo } from "react";
// import BootstrapTable from "react-bootstrap-table-next";
// import paginationFactory, {
//   PaginationProvider,
// } from "react-bootstrap-table2-paginator";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
// import * as actions from "../../../_redux/redux-Actions";
// import {
//   getHandlerTableChange,
//   NoRecordsFoundMessage,
//   PleaseWaitMessage,
//   sortCaret,
//   headerSortingClasses,
// } from "../../../../../../_metronic/_helpers";
// import { Pagination } from "../../../../../../_metronic/_partials/controls";
// import { formatDates, getFileName, getUploadUrl } from "../../../../../utils/common";
// import { format } from "date-fns";

// export function FormTable({ ticketStatuses, ticketTypes, priorityLevels }) {
//   const uiContext = useTaskAssignmentTimelineUIContext();
//   const dispatch = useDispatch();

//   const uiProps = useMemo(() => {
//     return {
//       ids: uiContext.ids,
//       setIds: uiContext.setIds,
//       queryParams: uiContext.queryParams,
//       setQueryParams: uiContext.setQueryParams,
//     };
//   }, [uiContext]);

//   const { currentState, allEmployees } = useSelector(
//     (state) => ({
//       currentState: state.task_assignment_timeline,
//       allEmployees: state.dashboard?.allEmployees || [],
//     }),
//     shallowEqual
//   );

//   useEffect(() => {
//     // Fetch task assignment timeline data based on queryParams
//     dispatch(actions.fetchTaskAssignmentTimeline(uiProps.queryParams));
//   }, [dispatch, uiProps.queryParams]);

//   const { entities, totalCount, listLoading } = currentState || {};

//   // Helper functions
//   const getEmployeeName = (employeeId) => {
//     const employee = allEmployees.find((emp) => emp.value === employeeId);
//     return employee ? employee.label : "N/A";
//   };

//   const getTicketTypeName = (ticketTypeId) => {
//     const ticketType = ticketTypes.find((type) => type.value === ticketTypeId);
//     return ticketType ? ticketType.label : "N/A";
//   };

//   const getTicketStatusName = (ticketStatusId) => {
//     const status = ticketStatuses.find((s) => s.value === ticketStatusId);
//     return status ? status.label : "N/A";
//   };

//   const getPriorityLevelName = (priorityLevelId) => {
//     const priority = priorityLevels.find((p) => p.value === priorityLevelId);
//     return priority ? priority.label : "N/A";
//   };

//   const getPriorityColor = (row) => {
//     // First check if color is already set in Details
//     if (row.Details && row.Details[0] && row.Details[0].color) {
//       return row.Details[0].color;
//     }
//     // Fallback to finding by priority level
//     const priority = priorityLevels.find((p) => p.value === row.priorityLevelId);
//     return priority?.color || "#808080";
//   };

//   // Ticket status options
//   const ticketStatusOptions = [
//     { value: 1, label: "Open" },
//     { value: 0, label: "Completed" },
//     { value: 3, label: "Re-opened" },
//     { value: 2, label: "In Review" },
//   ];

//   // Table columns
//   const columns = [
//     {
//       dataField: "Id",
//       text: "ID",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       hidden: true,
//     },
    
//     // Priority Color Indicator
//     {
//       dataField: "priorityLevelId",
//       text: "",
//       sort: false,
//       headerSortingClasses,
//       style: {
//         minWidth: "5px",
//         maxWidth: "20px",
//       },
//       formatter: (cell, row) => {
//         const color = getPriorityColor(row);
//         return (
//           <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             <span
//               style={{
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "50%",
//                 backgroundColor: color,
//                 display: "inline-block",
//               }}
//             ></span>
//           </span>
//         );
//       },
//     },

//     // Ticket Code
//     {
//       dataField: "ticketCode",
//       text: "Ticket Code",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "120px",
//       },
//       formatter: (cell) => {
//         if (!cell) return "";
//         return cell.length > 30 ? (
//           <span title={cell}>{cell.substring(0, 30) + "..."}</span>
//         ) : (
//           cell
//         );
//       },
//     },

//     // Ticket Type
//     {
//       dataField: "ticketType.formName",
//       text: "Ticket Type",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "120px",
//       },
//       formatter: (cell, row) => {
//         // Check both master level and detail level
//         const displayText = cell || row.Details?.[0]?.ticketType?.formName || getTicketTypeName(row.ticketTypeId);
//         if (!displayText) return "";
//         return displayText.length > 30 ? (
//           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//         ) : (
//           displayText
//         );
//       },
//     },

//     // Priority Level
//     {
//       dataField: "priorityLevel.formName",
//       text: "Priority",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "100px",
//       },
//       formatter: (cell, row) => {
//         const displayText = cell || row.Details?.[0]?.priorityLevel?.formName || getPriorityLevelName(row.priorityLevelId);
//         if (!displayText) return "";
//         return displayText.length > 30 ? (
//           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//         ) : (
//           displayText
//         );
//       },
//     },

//     // Ticket Description
//     {
//       dataField: "ticketDescription",
//       text: "Ticket Description",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "200px",
//       },
//       formatter: (cell) => {
//         if (!cell) return "";
//         return cell.length > 50 ? (
//           <span title={cell}>{cell.substring(0, 50) + "..."}</span>
//         ) : (
//           cell
//         );
//       },
//     },


//     // Assign To (from Details)
//     {
//       dataField: "Details[0].AssignToProfile.fullName",
//       text: "Assign To",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "150px",
//       },
//       formatter: (cell, row) => {
//         const displayText = row.Details?.[0]?.AssignToProfile?.fullName || getEmployeeName(row.assignTo);
//         if (!displayText) return "";
//         return displayText.length > 30 ? (
//           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//         ) : (
//           displayText
//         );
//       },
//     },

//     // Assign To Department
//     // {
//     //   dataField: "Details[0].AssignToProfile.department.deptName",
//     //   text: "Department (To)",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "120px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const displayText = row.Details?.[0]?.AssignToProfile?.department?.deptName;
//     //     if (!displayText) return "";
//     //     return displayText.length > 30 ? (
//     //       <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//     //     ) : (
//     //       displayText
//     //     );
//     //   },
//     // },

//     // Assign To Designation
//     // {
//     //   dataField: "Details[0].AssignToProfile.designation.formName",
//     //   text: "Designation (To)",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "120px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const displayText = row.Details?.[0]?.AssignToProfile?.designation?.formName;
//     //     if (!displayText) return "";
//     //     return displayText.length > 30 ? (
//     //       <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//     //     ) : (
//     //       displayText
//     //     );
//     //   },
//     // },

//     // Assign By (from Details)
//     {
//       dataField: "Details[0].AssignByProfile.fullName",
//       text: "Assign By",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "150px",
//       },
//       formatter: (cell, row) => {
//         const displayText = row.Details?.[0]?.AssignByProfile?.fullName || getEmployeeName(row.assignBy);
//         if (!displayText) return "";
//         return displayText.length > 30 ? (
//           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//         ) : (
//           displayText
//         );
//       },
//     },

//     // Assign By Department
//     // {
//     //   dataField: "Details[0].AssignByProfile.department.deptName",
//     //   text: "Department (By)",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "120px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const displayText = row.Details?.[0]?.AssignByProfile?.department?.deptName;
//     //     if (!displayText) return "";
//     //     return displayText.length > 30 ? (
//     //       <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//     //     ) : (
//     //       displayText
//     //     );
//     //   },
//     // },

//     // Assign By Designation
//     // {
//     //   dataField: "Details[0].AssignByProfile.designation.formName",
//     //   text: "Designation (By)",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "120px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const displayText = row.Details?.[0]?.AssignByProfile?.designation?.formName;
//     //     if (!displayText) return "";
//     //     return displayText.length > 30 ? (
//     //       <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//     //     ) : (
//     //       displayText
//     //     );
//     //   },
//     // },

//     // Ticket Date
//     {
//       dataField: "ticketDate",
//       text: "Ticket Date",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "120px",
//       },
//       formatter: (cell) => {
//         if (!cell) return "";
//         return format(new Date(cell), "dd-MMM-yyyy");
//       },
//     },

//     // Due Date
//     {
//       dataField: "Details[0].dueDate",
//       text: "Due Date",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "120px",
//       },
//       formatter: (cell, row) => {
//         const dueDate = row.Details?.[0]?.dueDate || row.dueDate;
//         if (!dueDate) return "";

//         const dueDateObj = new Date(dueDate);
//         const today = new Date();

//         // Reset time (compare only the date)
//         dueDateObj.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const isExpiredOrToday = dueDateObj <= today;

//         return (
//           <span
//             style={{
//               color: isExpiredOrToday ? "red" : "inherit",
//               fontWeight: isExpiredOrToday ? "600" : "normal",
//             }}
//           >
//             {format(dueDateObj, "dd-MMM-yyyy")}
//           </span>
//         );
//       },
//     },

//     // Time Range From
//     {
//       dataField: "Details[0].timeRangeFrom",
//       text: "From Time",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "100px",
//       },
//       formatter: (cell, row) => {
//         const displayText = row.Details?.[0]?.timeRangeFrom || row.timeRangeFrom;
//         if (!displayText) return "";
//         return displayText;
//       },
//     },

//     // Time Range To
//     {
//       dataField: "Details[0].timeRangeTo",
//       text: "To Time",
//       sort: false,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "100px",
//       },
//       formatter: (cell, row) => {
//         const displayText = row.Details?.[0]?.timeRangeTo || row.timeRangeTo;
//         if (!displayText) return "";
//         return displayText;
//       },
//     },

//     // No of Hours
//     {
//       dataField: "Details[0].noOfHours",
//       text: "No Of Hours",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "100px",
//       },
//       formatter: (cell, row) => {
//         const hours = row.Details?.[0]?.noOfHours || row.noOfHours;
//         return hours ? parseFloat(hours).toFixed(2) : "0.00";
//       },
//     },

//     // Remarks (from Details)
//     // {
//     //   dataField: "Details[0].remarks",
//     //   text: "Remarks",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "150px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const remarks = row.Details?.[0]?.remarks || row.remarks;
//     //     if (!remarks) return "";
//     //     return remarks.length > 40 ? (
//     //       <span title={remarks}>{remarks.substring(0, 40) + "..."}</span>
//     //     ) : (
//     //       remarks
//     //     );
//     //   },
//     // },

//     // File/Attachment
//     // {
//     //   dataField: "Details[0].file",
//     //   text: "Attachment",
//     //   sort: false,
//     //   sortCaret: sortCaret,
//     //   headerSortingClasses,
//     //   style: {
//     //     minWidth: "100px",
//     //   },
//     //   formatter: (cell, row) => {
//     //     const file = row.Details?.[0]?.file || row.file;
//     //     if (!file) return "";

//     //     return (
//     //       <a 
//     //         href={getUploadUrl(file)} 
//     //         target="_blank" 
//     //         rel="noopener noreferrer"
//     //         className="text-primary"
//     //       >
//     //         View File
//     //       </a>
//     //     );
//     //   },
//     // },

//     // Ticket Status
//     {
//       dataField: "ticketStatus",
//       text: "Status",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "100px",
//       },
//       formatter: (cell) => {
//         if (cell === null || cell === undefined) return "";

//         const status = ticketStatusOptions.find((opt) => opt.value === cell);
//         const displayText = status ? status.label : cell;

//         return displayText.length > 30 ? (
//           <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
//         ) : (
//           displayText
//         );
//       },
//     },

//     // Overdue Indicator
//     {
//       dataField: "Details[0].dueDate",
//       text: "",
//       sort: false,
//       headerSortingClasses,
//       style: {
//         minWidth: "80px",
//       },
//       formatter: (cell, row) => {
//         const dueDate = row.Details?.[0]?.dueDate || row.dueDate;
//         if (!dueDate) return "";

//         const dueDateObj = new Date(dueDate);
//         const today = new Date();

//         // Reset time (compare only the date)
//         dueDateObj.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const isExpiredOrToday = dueDateObj <= today;

//         return (
//           <>
//             {isExpiredOrToday && (
//               <span style={{ color: "red", fontWeight: 600 }}>
//                 Overdue
//               </span>
//             )}
//           </>
//         );
//       },
//     },

//     // Created At
//     {
//       dataField: "createdAt",
//       text: "Created Date",
//       sort: true,
//       sortCaret: sortCaret,
//       headerSortingClasses,
//       style: {
//         minWidth: "120px",
//       },
//       formatter: (cell) => {
//         if (!cell) return "";
//         return format(new Date(cell), "dd-MMM-yyyy");
//       },
//     },
//   ];

//   // Table pagination options
//   const paginationOptions = {
//     custom: true,
//     totalSize: totalCount || 0,
//     sizePerPageList: [
//       { text: "10", value: 10 },
//       { text: "20", value: 20 },
//       { text: "50", value: 50 },
//       { text: "100", value: 100 },
//     ],
//     sizePerPage: uiProps.queryParams.pageSize,
//     page: uiProps.queryParams.pageNumber,
//   };

//   return (
//     <div className="w-full overflow-x-auto">
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
//                 defaultSorted={[{ dataField: "ticketDate", order: "desc" }]}
//                 onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
//                 {...paginationTableProps}
//               >
//                 <PleaseWaitMessage entities={entities} />
//                 <NoRecordsFoundMessage entities={entities} />
//               </BootstrapTable>
//             </Pagination>
//           );
//         }}
//       </PaginationProvider>
//     </div>
//   );
// }

import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";

export function FormTable({ ticketStatuses, ticketTypes, priorityLevels }) {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const uiProps = useMemo(() => ({
    ids: uiContext.ids,
    setIds: uiContext.setIds,
    queryParams: uiContext.queryParams,
    setQueryParams: uiContext.setQueryParams,
  }), [uiContext]);

  const { currentState, allEmployees } = useSelector(
    (state) => ({
      currentState: state.task_assignment_timeline,
      allEmployees: state.dashboard?.allEmployees || [],
    }),
    shallowEqual
  );

  const { entities, listLoading } = currentState || {};

  useEffect(() => {
    if (uiProps.queryParams.isFiltered) {
      dispatch(actions.fetchTaskAssignmentTimeline(uiProps.queryParams));
    }
  }, [dispatch, uiProps.queryParams]);

  const getPriorityColor = (row) =>
    row.Details?.[0]?.color ||
    priorityLevels.find((p) => p.value === row.priorityLevelId)?.color ||
    "#808080";

  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];

  const columns = [
    { dataField: "Id", text: "ID", hidden: true },
    {
      dataField: "priorityLevelId",
      text: "",
      style: { minWidth: "30px" },
      formatter: (_, row) => (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: getPriorityColor(row),
            display: "inline-block",
          }}
        />
      ),
    },
    { dataField: "ticketCode", text: "Ticket Code", style: { minWidth: "130px" } },
    {
      dataField: "ticketType.formName",
      text: "Ticket Type",
      style: { minWidth: "140px" },
      formatter: (_, row) => row.ticketType?.formName || "N/A",
    },
    {
      dataField: "priorityLevel.formName",
      text: "Priority",
      style: { minWidth: "120px" },
      formatter: (_, row) => row.priorityLevel?.formName || "N/A",
    },
    { dataField: "ticketDescription", text: "Description", style: { minWidth: "240px" } },
    {
      dataField: "Details[0].AssignToProfile.fullName",
      text: "Current Owner",
      style: { minWidth: "160px" },
      formatter: (_, row) => row.Details?.[0]?.AssignToProfile?.fullName || "",
    },
    // {
    //   dataField: "Details[0].AssignByProfile.fullName",
    //   text: "Assign By",
    //   style: { minWidth: "160px" },
    //   formatter: (_, row) => row.Details?.[0]?.AssignByProfile?.fullName || "",
    // },
    {
      dataField: "ticketDate",
      text: "Ticket Date",
      style: { minWidth: "130px" },
      formatter: (c) => c && format(new Date(c), "dd-MMM-yyyy"),
    },
    {
      dataField: "Details[0].dueDate",
      text: "Due Date",
      style: { minWidth: "130px" },
      formatter: (_, row) =>
        row.Details?.[0]?.dueDate && format(new Date(row.Details[0].dueDate), "dd-MMM-yyyy"),
    },
    {
      dataField: "Details[0].noOfHours",
      text: "Hours",
      style: { minWidth: "100px" },
    },
    {
      dataField: "ticketStatus",
      text: "Status",
      style: { minWidth: "120px" },
      formatter: (c) => ticketStatusOptions.find((s) => s.value === c)?.label || "",
    },
  ];

  // Use queryParams.pageSize directly to control visible rows
  const tableData = uiProps.queryParams.isFiltered
    ? entities?.slice(0, uiProps.queryParams.pageSize)
    : [];

  return (
    <div className="timeline-scroll-wrapper">
      <BootstrapTable
        wrapperClasses=""
        bordered={false}
        classes="table table-head-custom table-vertical-center table-hover timeline-wide-table"
        bootstrap4
        remote
        keyField="Id"
        data={tableData}
        columns={columns}
        onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={tableData} />
        {!tableData.length && <NoRecordsFoundMessage entities={tableData} />}
      </BootstrapTable>
    </div>
  );
}
