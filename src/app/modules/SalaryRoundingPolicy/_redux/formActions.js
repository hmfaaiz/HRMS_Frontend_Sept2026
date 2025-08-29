import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { SalaryRoundingPolicySlice, callTypes } from "./salaryRoundingPolicySlice";
import { toast } from "react-toastify";
const { actions } = SalaryRoundingPolicySlice;

/**
 * 
 * Fetch All Rounding Policies Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchRoundingPolicies = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllRoundingPolicySetup(queryparm)
    .then((response) => {
      dispatch(actions.RoundingPolicyFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find receipts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * Fetch Single Rounding Policy Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.RoundingPolicyFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getRoundingPolicySetupById(id)
    .then((response) => {

      const entities = response.data?.data;
      dispatch(actions.RoundingPolicyFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Fetch Payment Mode Dropdown Data
 * 
 * @param {string|number} id (150 is the Parent Form Id of Payment Mode Menu data)
 * @returns
 */
export const fetchPaymentModeData = (id) => (dispatch) => {
  if (id) {
    return requestFromServer
      .getPaymentModeData(id)
      .then((response) => {
        const dropdownData = response.data?.data;
        dispatch(actions.paymentModeFetched({ dropdownData }));
      })
      .catch((error) => {
        error.clientMessage = "Can't find user";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  }
};

/**
 * 
 * Save or update Rounding Policy Record
 * 
 * @param {Object} data 
 * @param {String|Number|Null} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, id, disableLoading, onHide) => (dispatch) => {
  if (!id) {
    return requestFromServer.createRoundingPolicySetup(data)
      .then((res) => {
        const roundingData = res.data?.data;
        if (roundingData) {
          dispatch(actions.RoundingPolicyCreated(roundingData));
          disableLoading();
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
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Update Rounding Policy";
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
  }
  else {
    return requestFromServer.updateRoundingPolicySetup(data)
      .then((res) => {
        const roundingData = res.data?.data;
        if (roundingData) {
          dispatch(actions.RoundingPolicyUpdated(roundingData));
          disableLoading();
          toast.success(SERVER_MESSAGES.updatedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onHide();
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Update Rounding Policy";
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
  }
};

/**
 * 
 * Delete Single Rounding Policy Record By Id
 * 
 * @param {String|Number} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.deleteRoundingPolicySetup(id)
    .then((res) => {
      dispatch(actions.RoundingPolicyDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess, {
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
      disableLoading();
      error.clientMessage = "Can't Delete Rounding Policy";
      toast.error(SERVER_MESSAGES.deletedFail, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
}