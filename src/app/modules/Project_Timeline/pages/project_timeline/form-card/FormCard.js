import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useProjectTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { TicketType } from "../FormUIHelpers"; 
import {fetchProjectTimeline} from "../../../_redux/redux-Actions"


export function FormCard() {
  const uiContext = useProjectTimelineUIContext();
  const dispatch = useDispatch();
  const location = useLocation();

  // Extract ticket code if we navigated here via the Task Dashboard
  const match = location.pathname.match(
    /\/project_timeline\/read-all-project-timeline\/([^/]+)$/
  );
  const ticketCodeFromUrl = match ? decodeURIComponent(match[1]) : null;

  const { projects, ticketTypes, ticketStatuses, listLoading } = useSelector(
    (state) => ({
      projects: state.dashboard?.allProjects || [],
      // ticketTypes: state.dashboard?.allTicket || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      listLoading: state.project_timeline?.listLoading,
      pdfLoading: state.project_timeline?.pdfLoading,
      csvLoading: state.project_timeline?.csvLoading,
      excelLoading: state.project_timeline?.excelLoading,
    }),
    shallowEqual
  );

  const print = async (type) => {
  let updatedQueryParams = {
    ...uiContext.queryParams,
    csv: false,
    excel: false,
    pdf: false,
    [type]: true,
  };

  await dispatch(fetchProjectTimeline(updatedQueryParams));

  // reset flags
  uiContext.setQueryParams({
    ...uiContext.queryParams,
    csv: false,
    excel: false,
    pdf: false,
  });
};


  useEffect(() => {
    dispatch(actions.fetchAllProjects());
    // dispatch(actions.fetchAllTicket());
    dispatch(actions.fetchAllTicketStatus());
  }, [dispatch]);

return (
  <TCard name="Project Timeline">
    <FormFilter
      loading={listLoading}
      projects={projects}
      ticketTypes={TicketType}
      ticketStatuses={ticketStatuses}
      onPrint={print}
      ticketCodeFromUrl={ticketCodeFromUrl}
    />
    <FormTable ticketStatuses={ticketStatuses} ticketTypes={TicketType} />  {/* Pass ticketTypes */}
  </TCard>
);
}
