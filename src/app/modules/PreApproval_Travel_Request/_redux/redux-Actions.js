import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { preapproval_travel_requestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = preapproval_travel_requestSlice;


export const fetchPreApprovalTravelRequests = (queryparm) => async (dispatch) => {
  return requestFromServer.getAllPreApprovalTravelRequest(queryparm)
    .then((response) => {
      dispatch(actions.preapprovalTravelRequestFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchPreApprovalTravelRequest = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.preapprovalTravelRequestFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getPreApprovalTravelRequestById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.preapprovalTravelRequestFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletePreApprovalTravelRequest = (id) => (dispatch) => {
  return requestFromServer
    .deletePreApprovalTravelRequest(id)
    .then((response) => {
      dispatch(actions.preapprovalTravelRequestDeleted({ id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess);
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};


export const createPreApprovalTravelRequest = (preApprovalTravelRequestForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createPreApprovalTravelRequest(preApprovalTravelRequestForCreation)
    .then((res) => {
      const user = res.data?.data;
      dispatch(actions.preapprovalTravelRequestCreated(user));
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

export const updatePreApprovalTravelRequest = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updatePreApprovalTravelRequest(user)
    .then((response) => {
      const updatedPreApprovalTravelRequest = response.data?.data;
      dispatch(actions.preapprovalTravelRequestUpdated({ updatedPreApprovalTravelRequest }));
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
