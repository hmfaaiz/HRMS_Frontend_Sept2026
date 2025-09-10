import * as requestFromServer from "./redux-Crud";
import { DesignationMappingSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = DesignationMappingSlice;

export const fetchDesigMappings = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllDesigMapping(queryparm)
    .then((response) => {
      dispatch(actions.desigMapFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDesigMapping = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.desigMapFetchedForEdit({ userForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getDesigMappingById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.desigMapFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Something went wrong");
    });
};

export const fetchDesignationsByGradeId = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.allDesignationFetched([]));
  }
  return requestFromServer
    .getDesigByGradeId(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.allDesignationFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
    });
};

export const deleteDesigMappings = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteDesigMapping(id)
    .then((response) => {
      dispatch(actions.desigMapDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const updateDesigMappings = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateDesigMapping(data)
    .then((response) => {
      const updatedEmailConfig = response?.config?.data; // response.data?.data;

      dispatch(actions.desigMapUpdated({ updatedEmailConfig }));

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
