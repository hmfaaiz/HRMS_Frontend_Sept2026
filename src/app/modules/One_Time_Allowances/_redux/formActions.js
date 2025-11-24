import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { oneTimeAllowanceSlice, callTypes } from "./fromSlice";
import { toast } from "react-toastify";

const { actions } = oneTimeAllowanceSlice;

export const fetchAllOneTimeAllowance = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllOneTimeAllowance({ ...queryparm })
    .then((response) => {
      dispatch(actions.oneTimeAllowanceFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find allowance";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchOneTimeAllowance = (Id) => (dispatch) => {
  if (!Id) {
    return dispatch(
      actions.oneTimeAllowanceFetchedForEdit({ userForEdit: undefined })
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getOneTimeAllowanceById(Id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.oneTimeAllowanceFetchedForEdit({ userForEdit: entities })
      );
      return entities;
    })
    .catch((error) => {
      error.clientMessage = "Can't find allowance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteOneTimeAllowance = (Id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteOneTimeAllowance(Id)
    .then(() => {
      dispatch(actions.oneTimeAllowanceDeleted());
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
      toast.error(error.response.data.message);
    });
};

export const createOneTimeAllowance = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createOneTimeAllowance(data)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      dispatch(actions.oneTimeAllowanceCreated());
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
      error.clientMessage = "Can't create allowance";
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

export const updateOneTimeAllowance = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateOneTimeAllowance(data)
    .then((response) => {
      dispatch(actions.oneTimeAllowanceUpdated());
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
