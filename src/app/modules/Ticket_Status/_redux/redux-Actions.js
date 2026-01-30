import * as requestFromServer from "./redux-Crud";
import { ticketStatusSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ticketStatusSlice;

// Fetch all ticket statuses
export const fetchTicketStatuses = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllTicketStatuses(queryParams);
    dispatch(actions.ticketStatusesFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch ticket statuses");
  }
};

// Fetch a single ticket status by ID
export const fetchTicketStatus = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(
      actions.ticketStatusFetchedForEdit({ ticketStatusForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getTicketStatusById({ Id: id });
    const ticketStatus = response.data?.data;
    dispatch(
      actions.ticketStatusFetchedForEdit({ ticketStatusForEdit: ticketStatus })
    );
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find ticket status");
  }
};

// Create ticket status
export const createTicketStatus = (ticketStatusData, disableLoading, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createTicketStatus(ticketStatusData);
    const ticketStatus = res.data?.data;
    dispatch(actions.ticketStatusCreated(ticketStatus));
    disableLoading?.();
    onHide?.();
    toast.success("Ticket status successfully created");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading?.();
    toast.error(error?.response?.data?.message || "Can't create ticket status");
  }
};

// Update ticket status
export const updateTicketStatus = (ticketStatusData, disableLoading, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateTicketStatus(ticketStatusData);
    const updatedTicketStatus = res.data?.data;
    dispatch(actions.ticketStatusUpdated({ updatedTicketStatus }));
    disableLoading?.();
    onHide?.();
    toast.success("Ticket status successfully updated");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading?.();
    toast.error(error?.response?.data?.message || "Can't update ticket status");
  }
};

// Delete ticket status
export const deleteTicketStatus = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteTicketStatus({ Id: id });
    dispatch(actions.ticketStatusDeleted({ Id: id }));
    toast.success("Ticket status successfully deleted");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete ticket status");
  }
};
