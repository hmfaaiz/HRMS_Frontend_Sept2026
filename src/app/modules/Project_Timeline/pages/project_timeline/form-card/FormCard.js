import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useProjectTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { TicketType } from "../FormUIHelpers"; 


export function FormCard() {
  const uiContext = useProjectTimelineUIContext();
  const dispatch = useDispatch();

  const { projects, ticketTypes, ticketStatuses, listLoading } = useSelector(
    (state) => ({
      projects: state.dashboard?.allProjects || [],
      // ticketTypes: state.dashboard?.allTicket || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      listLoading: state.project_timeline?.listLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchAllProjects());
    // dispatch(actions.fetchAllTicket());
    dispatch(actions.fetchAllTicketStatus());
  }, [dispatch]);

  // ... existing code ...
return (
  <TCard name="Project Timeline">
    <FormFilter
      loading={listLoading}
      projects={projects}
      ticketTypes={TicketType}
      ticketStatuses={ticketStatuses}
    />
    <FormTable ticketStatuses={ticketStatuses} ticketTypes={TicketType} />  {/* Pass ticketTypes */}
  </TCard>
);
}
