import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchAttendance, fetchTaskAssignmentTimeline } from "../../../_redux/redux-Actions";
import { fetchMasterTicketType } from "../../../../Dashboard/_redux/dashboardActions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { AttendanceTable } from "../form-table/AttendanceTable";
import LogtimeSummaryTable from "../form-table/LogtimeSummaryTable";
export function FormCard() {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract a bare ticket-code segment from the URL, e.g. /read-all-.../TK-001
  // Must NOT match sub-modal routes like /TK-001/detail, /TK-001/timelog, etc.
  const ticketCodeMatch = location.pathname.match(
    /^\/task_group_report\/read-all-task-assignment-timeline\/([^/]+)$/,
  );
  const ticketCodeFromUrl = ticketCodeMatch
    ? decodeURIComponent(ticketCodeMatch[1])
    : null;

  const [showTicketDetails, setShowTicketDetails] = useState(true);
  const [currentStatusToggle, setCurrentStatusToggle] = useState(false);

  const [expandedMasterIds, setExpandedMasterIds] = useState([]);
  const [reportType, setReportType] = useState(0);
  const {

    allEmployees,
    ticketTypes,
    ticketStatuses,
    priorityLevels,
    listLoading,
    pdfLoading,
    csvLoading,
    excelLoading,
  } = useSelector(
    (state) => ({
      allEmployees: state.dashboard?.allEmployees || [],
      ticketTypes: state.dashboard?.allMasterTicketType || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      priorityLevels: state.dashboard?.priorityLevelList || [],
      listLoading: state.task_group_report?.listLoading,
      pdfLoading: state.task_group_report?.pdfLoading,
      csvLoading: state.task_group_report?.csvLoading,
      excelLoading: state.task_group_report?.excelLoading,
    }),
    shallowEqual
  );

  // const print = async (type) => {
  //   let updatedQueryParams = {
  //     ...uiContext.queryParams,
  //     pdf: false,
  //     csv: false,
  //     excel: false,
  //     [type]: true,
  //     showTicketDetails,
  //     expandedMasterIds: showTicketDetails ? expandedMasterIds : [],
  //   };
  //   await dispatch(fetchTaskAssignmentTimeline(updatedQueryParams));
  //   uiContext.setQueryParams({
  //     ...uiContext.queryParams,
  //     pdf: false,
  //     csv: false,
  //     excel: false,
  //   });
  // };

useEffect(() => {
  dispatch(actions.FetchAllFacilitatorEmployee());
  dispatch(fetchMasterTicketType());
  dispatch(actions.fetchAllTicketStatus());
  dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
}, [dispatch]);

// useEffect(() => {
//   const queryParams = uiContext.queryParams;
// console.log("queryParams1111");
//   if (!queryParams?.isFiltered) return;

//   const type = queryParams?.filter?.reportType ?? 0;

//   if (type === 0) {
//     dispatch(fetchTaskAssignmentTimeline(queryParams));
//   } else if (type === 1) {
//     dispatch(fetchAttendance(queryParams));
//   }
// }, [uiContext.queryParams, dispatch]);

  return (
    <TCard name={CurrentModuleName()}>
      <FormFilter
        loading={listLoading || pdfLoading || csvLoading || excelLoading}
        employees={allEmployees}
        ticketTypes={ticketTypes}
        ticketStatuses={ticketStatuses}
        priorityLevels={priorityLevels}
        onPrint={print}
        showTicketDetails={showTicketDetails}
        onTicketDetailsChange={setShowTicketDetails}
        setCurrentStatusToggle={setCurrentStatusToggle}
        currentStatusToggle={currentStatusToggle}
        ticketCodeFromUrl={ticketCodeFromUrl}
        reportType={reportType}
        setReportType={setReportType}
      />
      {reportType === 0 && (
        <FormTable
          ticketStatuses={ticketStatuses}
          ticketTypes={ticketTypes}
          priorityLevels={priorityLevels}
          showTicketDetails={showTicketDetails}
          // FormTable calls this whenever a row is expanded/collapsed
          onExpandedRowsChange={setExpandedMasterIds}
          currentStatusToggle={currentStatusToggle}
        />
      )}
      {reportType === 1 && (
        <AttendanceTable />
      )}  
      {reportType === 2 && (
        <LogtimeSummaryTable />
      )}
    </TCard>
  );
}