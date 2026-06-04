import * as requestFromServer from "./redux-Crud";
import { Ai_Api_ConfigurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = Ai_Api_ConfigurationSlice;

export const fetchAiApiConfigurations = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllAiApiConfigurations(queryparm)
    .then((response) => {
      dispatch(actions.aiApiConfigurationFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAiApiConfiguration = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.aiApiConfigurationFetchedForEdit({ userForEdit: undefined })
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAiApiConfigurationById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.aiApiConfigurationFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAiApiConfiguration = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteAiApiConfiguration(id)
    .then((response) => {
      dispatch(actions.aiApiConfigurationDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const createAiApiConfiguration = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createAiApiConfiguration(data)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.aiApiConfigurationCreated(user));
      toast.success(SERVER_MESSAGES.insertedSuccess);
      disbaleLoading();
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create ai api config";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
      disbaleLoading();
    });
};

export const updateAiApiConfiguration = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateAiApiConfiguration(data)
    .then((response) => {
      const updatedAiApiConfiguration = response?.config?.data; // response.data?.data;

      dispatch(actions.aiApiConfigurationUpdated({ updatedAiApiConfiguration }));

      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
      disbaleLoading();
    });
};

export const verifyAiApiConfiguration = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .verifyAiApiConfiguration(id)
    .then((response) => {
      dispatch(actions.aiApiConfigurationVerified({ Id: id }));
      toast.success(SERVER_MESSAGES.processSuccessful);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message);
    });
};
