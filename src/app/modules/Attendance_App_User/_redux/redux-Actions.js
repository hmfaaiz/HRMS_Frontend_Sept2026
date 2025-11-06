import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { attAppUserSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = attAppUserSlice;

export const fetchAttAppUser = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllAttAppUser(queryparm)
    .then((response) => {
      dispatch(actions.AttAppUserFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAttAppUserById = (id) => (dispatch) => {
  dispatch(actions.startCall({ callTypes: callTypes.action }));
  if (!id) {
    return dispatch(
      actions.AttAppUserFetchForStatusUpdate({ userForEdit: undefined })
    );
  }
  return requestFromServer
    .getAttAppUserById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.AttAppUserFetchForStatusUpdate({ userForEdit: entities })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateAttAppUser = (Id, disbaleLoading, onHide) => (dispatch) => {
  dispatch(actions.startCall({ callTypes: callTypes.action }));
  return requestFromServer
    .updateAttAppUser({ Id })
    .then((response) => {
      dispatch(actions.AppraisalConfigUpdated());
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
