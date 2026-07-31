import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { bonus_processSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = bonus_processSlice;


export const fetchBonusProcess = (params) => async (dispatch) => {

  return requestFromServer.getAllBonusProcess(params)
    .then((response) => {
      dispatch(actions.bonusProcessFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchmoduledata = (id) => (dispatch) => {

  if (!id) {
    return dispatch(actions.BonusProcessFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getBonusProcessById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.BonusProcessFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteBonusProcess = (id) => (dispatch) => {

  return requestFromServer
    .deleteBonusProcess({ Id: id })
    .then((response) => {

      dispatch(actions.BonusProcessDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 2000,
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


export const createBonusProcess = (bonusProcessForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  dispatch(actions.checkBonus_EmployeesByIdsFetched(null));
  return requestFromServer
    .createBonusProcess(bonusProcessForCreation)
    .then((res) => {

      const result = res.data?.data;

      dispatch(actions.resultAfterBonusProcessFetched(result))
      disbaleLoading();

      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    })
    .catch((error) => {
      error.clientMessage = "Can't create record";
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


export const updateBonusProcess = (data, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateBonusProcess(data)
    .then((response) => {

      const updatedBonusProcess = response?.config?.data;

      dispatch(actions.clearUserForEdit());
      dispatch(actions.bonusProcessUpdated({ updatedBonusProcess }));

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


export const fetchBonusPolicyDetail = (params) => async (dispatch) => {

  return requestFromServer.getBonusPolicyDetail(params)
    .then((response) => {
      dispatch(actions.bonusPolicyDetailFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const checkBonus_EmployeesByIds = (data) => async (dispatch) => {

  return requestFromServer.checkBonus_EmployeesByIds(data)
    .then((response) => {
      dispatch(actions.checkBonus_EmployeesByIdsFetched(response));

      if (response.data.data == true) {
        toast.success(SERVER_MESSAGES.updatedSuccess, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    })
    .catch((error) => {
      dispatch(actions.checkBonus_EmployeesByIdsFetched(null));
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const clearReduxData = () => async (dispatch) => {
  dispatch(actions.checkBonus_EmployeesByIdsFetched(null));
  dispatch(actions.bonusPolicyDetailFetched(null));
  dispatch(actions.resultAfterBonusProcessFetched(null));
  dispatch(actions.bonusProcessCleared());
}