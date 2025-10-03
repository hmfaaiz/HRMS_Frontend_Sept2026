import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { appraisalRatingSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = appraisalRatingSlice;

export const fetchAppraisalRatings = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllAppraisalRating(queryparm)

    .then((response) => {
      dispatch(actions.AppraisalRatingFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalRatingById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.AppraisalRatingFetchedForEdit({ userForEdit: undefined })
    );
  }
  return requestFromServer
    .getAppraisalRatingById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.AppraisalRatingFetchedForEdit({ userForEdit: entities })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAppraisalRating = (id) => (dispatch) => {
  return requestFromServer
    .deleteAppraisalRating({ Id: id })
    .then((response) => {
      dispatch(actions.AppraisalRatingDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const createAppraisalRating = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createAppraisalRating(data)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.AppraisalRatingCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const updateAppraisalRating = (user, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .updateAppraisalRating(user)
    .then((response) => {
      const updatedIncomeTaxSlab = response?.config?.data; // response.data?.data;

      dispatch(actions.AppraisalRatingUpdated({ updatedIncomeTaxSlab }));

      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};
