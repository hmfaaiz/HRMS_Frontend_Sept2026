import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ticketSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ticketSetupSlice;

// Fetch all tickets
export const fetchTickets = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllTickets(queryParams);
    dispatch(actions.ticketsFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch tickets");
  }
};

// Fetch ticket by ID
export const fetchTicket = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(actions.ticketFetchedForEdit({ dataForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getTicketById({ Id: id });
    const ticket = response.data?.data;
    dispatch(actions.ticketFetchedForEdit({ dataForEdit: ticket }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find ticket");
  }
};

// Create ticket
export const createTicket = (ticketData, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createTicket(ticketData);
    const ticket = res.data?.data;
    dispatch(actions.ticketCreated(ticket));
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't create ticket");
  }
};

// Update ticket
export const updateTicket = (ticketData, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateTicket(ticketData);
    dispatch(actions.ticketUpdated());
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't update ticket");
  }
};

// Delete ticket
export const deleteTicket = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteTicket({ Id: id });
    dispatch(actions.ticketDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete ticket");
  }
};

export const getLatestTicketNumBaseOnProjectId = (Id) => async () => {
  return await requestFromServer
    .getLatestTicketNumBaseOnProjectId({ Id })
    .then((response) => {
      return response?.data?.data;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message);
    });
};
