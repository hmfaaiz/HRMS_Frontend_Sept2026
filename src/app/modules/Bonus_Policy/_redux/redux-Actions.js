// _redux/redux-Actions.js
import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { bonusPolicySlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = bonusPolicySlice;

export const fetchBonusPolicy = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllBonusPolicy(queryparm)
    .then((response) => {
      dispatch(actions.BonusPolicyFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchBonusPolicyById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(
      actions.BonusPolicyFetchedForEdit({ userForEdit: undefined })
    );
  }
  return requestFromServer
    .getBonusPolicyById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.BonusPolicyFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find bonus policy";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteBonusPolicy = (id) => (dispatch) => {
  return requestFromServer
    .deleteBonusPolicy({ Id: id })
    .then(() => {
      dispatch(actions.BonusPolicyDeleted({ Id: id }));
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

export const createBonusPolicy = (data, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createBonusPolicy(data)
    .then((res) => {
      const bonusPolicy = res.data?.data;
      dispatch(actions.BonusPolicyCreated(bonusPolicy));
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
      error.clientMessage = "Can't create bonus policy";
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

export const updateBonusPolicy = (bonusPolicy, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .updateBonusPolicy(bonusPolicy)
    .then((response) => {
      const updatedBonusPolicy = response.data?.data;
      dispatch(actions.BonusPolicyUpdated({ updatedBonusPolicy }));
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

export const fetchActiveEarningsBySubsidiary = (subsidiaryId) => (dispatch) => {
  return requestFromServer
    .getActiveEarningsBySubsidiary({ subsidiaryId })
    .then((response) => {
      const entities = (response.data?.data || []).map((e) => ({
        label: e.earningName,
        value: e.Id,
      }));
      dispatch(actions.BonusPolicyEarningsFetched(entities));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};