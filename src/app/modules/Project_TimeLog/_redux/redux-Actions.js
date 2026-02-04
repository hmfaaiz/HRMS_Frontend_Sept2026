import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { projectTimeLogSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = projectTimeLogSetupSlice;

// Fetch all tickets
export const fetchTimeLogs = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllTimeLogs(queryParams);
    dispatch(actions.timeLogsFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch tickets");
  }
};

// Fetch ticket by ID
export const fetchTimeLog = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(actions.timeLogFetchedForEdit({ dataForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getTimeLogById({ Id: id });
    const ticket = response.data?.data;
    dispatch(actions.timeLogFetchedForEdit({ dataForEdit: ticket }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find ticket");
  }
};

// Create ticket
export const createTimeLog = (data) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createTimeLog(data);
    const ticket = res.data?.data;
    dispatch(actions.timeLogCreated(ticket));
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't create ticket");
  }
};

// Update ticket
export const updateTimeLog = (data) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateTimeLog(data);
    dispatch(actions.timeLogUpdated());
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't update ticket");
  }
};

// Delete ticket
export const deleteTimeLog = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteTimeLog({ Id: id });
    dispatch(actions.timeLogDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete ticket");
  }
};
