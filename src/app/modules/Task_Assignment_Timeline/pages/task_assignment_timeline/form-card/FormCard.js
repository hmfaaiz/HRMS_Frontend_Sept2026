import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchTaskAssignmentTimeline } from "../../../_redux/redux-Actions";
import {  fetchMasterTicketType } from "../../../../Dashboard/_redux/dashboardActions";
export function FormCard() {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const [showTicketDetails, setShowTicketDetails] = useState(false);

  const [expandedMasterIds, setExpandedMasterIds] = useState([]);

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
      listLoading: state.task_assignment_timeline?.listLoading,
      pdfLoading: state.task_assignment_timeline?.pdfLoading,
      csvLoading: state.task_assignment_timeline?.csvLoading,
      excelLoading: state.task_assignment_timeline?.excelLoading,
    }),
    shallowEqual
  );

  const print = async (type) => {
    let updatedQueryParams = {
      ...uiContext.queryParams,
      pdf: false,
      csv: false,
      excel: false,
      [type]: true,
      showTicketDetails,
      expandedMasterIds: showTicketDetails ? expandedMasterIds : [],
    };
    await dispatch(fetchTaskAssignmentTimeline(updatedQueryParams));
    uiContext.setQueryParams({
      ...uiContext.queryParams,
      pdf: false,
      csv: false,
      excel: false,
    });
  };

  useEffect(() => {
    dispatch(actions.FetchAllFacilitatorEmployee());
    dispatch(fetchMasterTicketType());
     dispatch(actions.fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
  }, [dispatch]);

  return (
    <TCard name="Task Assignment Timeline">
      <FormFilter
        loading={listLoading || pdfLoading || csvLoading || excelLoading}
        employees={allEmployees}
        ticketTypes={ticketTypes}
        ticketStatuses={ticketStatuses}
        priorityLevels={priorityLevels}
        onPrint={print}
        showTicketDetails={showTicketDetails}
        onTicketDetailsChange={setShowTicketDetails}
      />
      <FormTable
        ticketStatuses={ticketStatuses}
        ticketTypes={ticketTypes}
        priorityLevels={priorityLevels}
        showTicketDetails={showTicketDetails}
        // FormTable calls this whenever a row is expanded/collapsed
        onExpandedRowsChange={setExpandedMasterIds}
      />
    </TCard>
  );
}