import * as requestFromServer from "./redux-Crud";
import { GeoLocationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = GeoLocationSlice;

export const fetchGeoLocations = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllGeoLocation(queryparm)
    .then((response) => {
      dispatch(actions.GeoLocationsFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchGeoLocationById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.GeoLocationFetchedForEdit({ userForEdit: undefined })
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getGeoLocationById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.GeoLocationFetchedForEdit({ userForEdit: entities }));
      return entities;
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Something went wrong");
    });
};

export const deleteGeoLocation = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteGeoLocation(id)
    .then((response) => {
      dispatch(actions.GeoLocationDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const updateGeoLocation = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateGeoLocation(data)
    .then((response) => {
      const res = response?.config?.data; // response.data?.data;

      dispatch(actions.updateGeoLocation({ res }));

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
