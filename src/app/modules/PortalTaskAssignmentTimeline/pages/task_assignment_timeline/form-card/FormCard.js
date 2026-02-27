import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFilter } from "../form-filter/FormFilter";
import { FormTable } from "../form-table/FormTable";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { fetchTaskAssignmentTimeline } from "../../../_redux/redux-Actions";

export function FormCard() {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const { 
    allEmployees, 
    allMasterTicketType, 
    ticketStatuses, 
    priorityLevels,
    listLoading ,
    pdfLoading,
    csvLoading,
    excelLoading,
  } = useSelector(
    (state) => ({
      allEmployees: state.dashboard?.allEmployees || [],
      allMasterTicketType: state.dashboard?.allMasterTicketType || [],
      ticketStatuses: state.dashboard?.allTicketStatus || [],
      priorityLevels: state.dashboard?.priorityLevelList || [],
      listLoading: state.portal_task_assignment_timeline?.listLoading,
       pdfLoading: state.portal_task_assignment_timeline?.pdfLoading,
      csvLoading: state.portal_task_assignment_timeline?.csvLoading,
      excelLoading: state.portal_task_assignment_timeline?.excelLoading,
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
    };
    await dispatch(fetchTaskAssignmentTimeline(updatedQueryParams));

    // reset flags
    uiContext.setQueryParams({
      ...uiContext.queryParams,
      pdf: false,
      csv: false,
      excel: false,
    });
  };


  useEffect(() => {
    dispatch(actions.FetchAllFacilitatorEmployee());
    dispatch(actions.fetchMasterTicketType());
    dispatch(actions.fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(546, "priorityLevelList"));
  }, [dispatch]);

   return (
    
    <>
    
      <FormFilter
        loading={listLoading || pdfLoading || csvLoading || excelLoading}
        employees={allEmployees}
        ticketTypes={allMasterTicketType}
        ticketStatuses={ticketStatuses}
        priorityLevels={priorityLevels}
        onPrint={print}
      />
      <FormTable 
        ticketStatuses={ticketStatuses} 
        ticketTypes={allMasterTicketType} 
        priorityLevels={priorityLevels}
      />
    
    
    </>
    

  );
}