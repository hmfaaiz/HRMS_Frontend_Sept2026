import * as requestFromServer from "./formCrud";
import { empAppraisalReviewSlice, callTypes } from "./fromSlice";
import { toast } from "react-toastify";

const { actions } = empAppraisalReviewSlice;

export const fetchAllAppraisalEmployee = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalEmployee(payload)
    .then((response) => {
      dispatch(actions.appraisalEmployeeFetched(response?.data?.data || []));
    })
    .catch((error) => {
      error.clientMessage = "Can't find allowance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchAllAppraisalReview = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllAppraisalReview(queryparm)

    .then((response) => {
      dispatch(actions.AppraisalReviewFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalReview = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalReview(payload)

    .then((response) => {
      dispatch(actions.AppraisalReviewFetchedById(response?.data?.data || {}));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createOrUpdateAppraisalReview = (payload, onHide) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createOrUpdateAppraisalReview(payload)

    .then((response) => {
      dispatch(actions.AppraisalReviewCreated());
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      onHide();
    });
};

export const deleteAppraisalReview = (payload, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteAppraisalReview(payload)

    .then((response) => {
      dispatch(actions.AppraisalReviewDeleted());
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      onHide();
    });
};

export const clearAppraisalReview = (onHide) => async (dispatch) => {
  dispatch(actions.AppraisalReviewDeleted());
  if (onHide) {
    onHide();
  }
};


export const appraisalPublishRatingFetch = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalPublishRating(payload)

    .then((response) => {
      dispatch(actions.appraisalPublishRatingFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
