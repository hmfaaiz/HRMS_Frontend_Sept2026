import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {tada_configurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = tada_configurationSlice;


export const fetchTadaConfigs = (queryparm) => async (dispatch) => {
  return requestFromServer.getAllTadaConfig(queryparm)
    .then((response) => {
      dispatch(actions.tadaConfigFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchTadaConfig = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.TadaConfigFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getTadaConfigById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.TadaConfigFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteTadaConfig = (id) => (dispatch) => {
  return requestFromServer
    .deleteTadaConfig(id)
    .then((response) => {
      dispatch(actions.TadaConfigDeleted({ id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};


export const createTadaConfig = (tadaConfigForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createTadaConfig(tadaConfigForCreation)
    .then((res) => {
      const user = res.data?.data;
      dispatch(actions.tadaConfigCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess);
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.insertedFail);
    });
};

export const updateTadaConfig = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateTadaConfig(user)
    .then((response) => {
      const updatedTadaConfig = response?.config?.data;
      dispatch(actions.tadaConfigUpdated({ updatedTadaConfig }));
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.updatedFail);
    });
};
