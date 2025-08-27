import * as requestFromServer from "./redux-Crud";
import { EmailConfigurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = EmailConfigurationSlice;

export const fetchEmailConfigs = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllEmailConfigs(queryparm)
    .then((response) => {
      dispatch(actions.emailConfigFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEmailConfig = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.emailConfigFetchedForEdit({ userForEdit: undefined })
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmailConfigById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.emailConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmailConfig = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteEmailConfig(id)
    .then((response) => {
      dispatch(actions.emailConfigDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const createEmailConfig = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createEmailConfig(data)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.emailConfigCreated(user));
      toast.success(SERVER_MESSAGES.insertedSuccess);
      disbaleLoading();
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create email config";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
      onHide();
      disbaleLoading();
    });
};

export const updateEmailConfig = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateEmailConfig(data)
    .then((response) => {
      const updatedEmailConfig = response?.config?.data; // response.data?.data;

      dispatch(actions.emailConfigUpdated({ updatedEmailConfig }));

      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
      disbaleLoading();
      onHide();
    });
};

export const verifyEmailConfig = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .verifyEmailConfig(id)
    .then((response) => {
      dispatch(actions.emailConfigVerified({ Id: id }));
      toast.success(SERVER_MESSAGES.processSuccessful);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
    });
};
