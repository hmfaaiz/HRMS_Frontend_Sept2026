import { toast } from "react-toastify";
import { projectTimelineSlice, callTypes } from "./redux-Slice";
import * as requestFromServer from "./redux-Crud";

const { actions } = projectTimelineSlice;

// Fetch project timeline tickets with filters & pagination
export const fetchProjectTimeline = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getProjectTimeline(queryParams);
    dispatch(actions.timelineFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch project timeline");
  }
};

// Update ticket statuses & types (bulk)
export const updateTicketStatuses = (updatedEntities, currentQueryParams) => async (dispatch) => {
  if (!updatedEntities.length) {
    toast.info("No changes to save.");
    return;
  }

  dispatch(actions.startCall({ callType: callTypes.update }));

  try {
    //payload: array of { Id, ticketStatusId, ticketTypeId, priority, assignToEmpId, reportToEmpId, dueDate }
    const updates = updatedEntities.map(entity => ({
      Id: entity.Id,
      ticketStatusId: entity.ticketStatusId,
      ticketTypeId: entity.ticketTypeId,
      priority: entity.priority, 
      assignToEmpId: entity.assignToEmpId,  
      reportToEmpId: entity.reportToEmpId, 
      dueDate: entity.dueDate,  
    }));

    await requestFromServer.updateTicketStatuses({ updates });
    dispatch(actions.ticketStatusesUpdated());
    toast.success("Tickets updated successfully!");

    // Refetch timeline with current query params
    if (currentQueryParams) {
      dispatch(fetchProjectTimeline(currentQueryParams));  
    }
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.update }));
    toast.error(error?.response?.data?.message || "Failed to update tickets");
  }
};

export const clearProjectTimeline = () => (dispatch) => {
  dispatch(actions.timelineCleared());
};
