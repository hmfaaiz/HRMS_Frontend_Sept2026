import * as requestFromServer from "./redux-Crud";
import { ticketActivityPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ticketActivityPortalSlice;

// Fetch all tickets
export const fetchTicketComments = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const response = await requestFromServer.getAllTicketComments(payload);
    dispatch(actions.ticketCommentsFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't fetch tickets  comments",
    );
  }
};

// Fetch ticket by ID
export const createOrUpdateTicketComments = (data) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const response = await requestFromServer.createOrUpdateComment(data);
    const ticket = response.data?.data;
    if (data?.Id) {
      dispatch(actions.ticketCommentsUpdated(ticket));
    } else {
      dispatch(actions.ticketCommentsCreated(ticket));
    }
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't  comment");
  }
};

export const fetchAllSubTickets = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllSubTickets(queryParams);
    dispatch(actions.ticketsFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch tickets");
  }
};

export const clearReduxState = () => async (dispatch) => {
  dispatch(actions.clearState());
};

export const deleteComment = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteComment({ Id });
    dispatch(actions.ticketCommentsDeleted({ Id }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't  comment");
  }
};
