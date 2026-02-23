import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchTaskAssignmentTimeline } from "../../../_redux/redux-Actions";

export function FormCard() {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const [showTicketDetails, setShowTicketDetails] = useState(false);

  // Tracks which master row Ids are currently expanded in the table
  // Passed to export so backend can include their detail rows in the file
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
      ticketTypes: state.dashboard?.allTicketTypeList || [],
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
      // Pass expanded master Ids and whether ticket details mode is ON
      // Backend uses these to include detail rows under each expanded ticket
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
    dispatch(fetchAllFormsMenu(545, "allTicketTypeList"));
    dispatch(actions.fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
  }, [dispatch]);

  return (
    <TCard name="Task Assignment Timeline">
      <FormFilter
        loading={listLoading || pdfLoading || csvLoading || excelLoading}
        employees={allEmployees}
        ticketTypes={ticketTypes.filter((o) => o.label !== "Escalation Ticket")}
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