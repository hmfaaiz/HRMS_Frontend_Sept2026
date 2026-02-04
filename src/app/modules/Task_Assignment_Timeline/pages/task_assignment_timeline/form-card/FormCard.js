import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";

export function FormCard() {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const { 
    allEmployees, 
    ticketTypes, 
    ticketStatuses, 
    priorityLevels,
    listLoading 
  } = useSelector(
    (state) => ({
      allEmployees: state.dashboard?.allEmployees || [],
      ticketTypes: state.dashboard?.allTicketTypeList || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      priorityLevels: state.dashboard?.priorityLevelList || [],
      listLoading: state.task_assignment_timeline?.listLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.FetchAllFacilitatorEmployee());
    dispatch(fetchAllFormsMenu(545, "allTicketTypeList"));
    dispatch(actions.fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
  }, [dispatch]);

  return (
    <TCard name="Task Assignment Timeline">
      <FormFilter
        loading={listLoading}
        employees={allEmployees}
        ticketTypes={ticketTypes.filter(option => option.label !== "Escalation Ticket")}
        ticketStatuses={ticketStatuses}
        priorityLevels={priorityLevels}
      />
      <FormTable 
        ticketStatuses={ticketStatuses} 
        ticketTypes={ticketTypes} 
        priorityLevels={priorityLevels}
      />
    </TCard>
  );
}