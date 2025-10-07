import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { appraisalConfigSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = appraisalConfigSlice;

export const fetchAppraisalConfig = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllAppraisalConfig(queryparm)

    .then((response) => {
      dispatch(actions.AppraisalConfigFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalConfigById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.AppraisalConfigFetchedForEdit({ userForEdit: undefined })
    );
  }
  return requestFromServer
    .getAppraisalConfigById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.AppraisalConfigFetchedForEdit({ userForEdit: entities })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteAppraisalConfig = (id) => (dispatch) => {
  return requestFromServer
    .deleteAppraisalConfig({ Id: id })
    .then((response) => {
      dispatch(actions.AppraisalConfigDeleted({ Id: id }));
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

export const createAppraisalConfig = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createAppraisalConfig(data)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.AppraisalConfigCreated(user));
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

export const updateAppraisalConfig = (user, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .updateAppraisalConfig(user)
    .then((response) => {
      const updatedIncomeTaxSlab = response?.config?.data; // response.data?.data;

      dispatch(actions.AppraisalConfigUpdated({ updatedIncomeTaxSlab }));

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
