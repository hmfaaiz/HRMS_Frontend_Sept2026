import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { leaveManagementConfigurationSlice, callTypes } from "./leaveManagementConfigurationSlice";
import { toast } from "react-toastify";
const { actions } = leaveManagementConfigurationSlice;

/**
 * 
 * Fetch All Leave Configurations Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchleaveManagementConfiguration = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllleaveManagementConfigurationSetup(queryparm)
    .then((response) => {
      dispatch(actions.leaveManagementConfigurationFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Configurations";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * This function will fetch Leave Configuration data from server.
 * Pyload consist of keys to filter from in the db. If Payload is not present it will just set null state key (In Add new Dialog)
 * 
 * oldData is used when dropdowns are changed and data is needed to be fetched according to dropdown values.
 * If no data is found from dropdown values then it will set the values provided in oldData key in the form
 *  
 * @param {Object} payload 
 * @param {Object} oldData 
 * @returns 
 */
export const fetchEditRecord = (payload, oldData = null) => (dispatch) => {
  if (!payload) {
    return dispatch(actions.leaveManagementConfigurationFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getleaveManagementConfigurationSetupById(payload)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.leaveManagementConfigurationFetchedForEdit({ userForEdit: entities || oldData }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Configurations";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Save or update Leave Configurations Record
 * 
 * @param {Object} data 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, disableLoading, onHide) => (dispatch) => {
  if (!data.Id) {
    return requestFromServer.createleaveManagementConfigurationSetup(data)
      .then((res) => {
        const leaveManagementConfigurationData = res.data?.data;
        if (leaveManagementConfigurationData) {
          disableLoading();
          dispatch(actions.leaveManagementConfigurationCreated(leaveManagementConfigurationData));
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
        error.clientMessage = "Can't Create Leave Configurations";
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
    return requestFromServer.updateleaveManagementConfigurationSetup(data)
      .then((res) => {
        const leaveManagementConfigurationData = res.data?.data;
        if (leaveManagementConfigurationData) {
          disableLoading();
          dispatch(actions.leaveManagementConfigurationUpdated(leaveManagementConfigurationData));
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
        error.clientMessage = "Can't Update Leave Configurations";
        toast.error(SERVER_MESSAGES.updatedFail, {
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
 * Delete Single Leave Configurations Record By Id
 * 
 * @param {String|Number} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.deleteleaveManagementConfigurationSetup(id)
    .then((res) => {
      dispatch(actions.leaveManagementConfigurationDeleted({ id }));
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
      error.clientMessage = "Can't Delete Leave Configurations";
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


/**
 * 
 * This will Delete the Leave Type Policy record from server if Id is present
 * then remove function will remove the record from view table for UI
 * 
 * @param {String|Number} id 
 * @param {Function} remove 
 * @param {Number} index 
 * @returns 
 */
export const deleteLeaveTypePolicyRecord = (id, remove, index) => (dispatch) => {
  if(!id){
    remove(index);
    return;
  }
  return requestFromServer.deletleaveTypePolicySetup(id)
    .then((res) => {
      remove(index)
    })
    .catch((error) => {
      error.clientMessage = "Can't Delete Leave Type Policy";
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

/**
 * 
 * This will Delete the Leave Type deduction Policy record from server if Id is present
 * then remove function will remove the record from view table for UI
 * 
 * @param {String|Number} id 
 * @param {Function} remove 
 * @param {Number} index 
 * @returns 
 */
export const deleteLeaveTypeDeductionPolicyRecord = (id, remove, index) => (dispatch) => {
  if (!id) {
    remove(index);
    return;
  }
  return requestFromServer.deletleaveTypeDeductionPolicySetup(id)
    .then((res) => {
      remove(index)
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.deletedFail;
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


/**
 * 
 * Save Allocate Leaves Record
 * 
 * @param {Object} data 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const allocateLeaves = (data, disableLoading, onHide) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.allocation }));
  return requestFromServer.createAllocateLeavesSetup(data)
    .then((res) => {
      const AllocateLeavesData = res.data?.data;
      if (AllocateLeavesData) {
        dispatch(actions.AllocateLeavesCreated(AllocateLeavesData));
        toast.success("Successfully Allocated", {
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
      dispatch(actions.catchError({ error, callType: callTypes.allocation }));
      error.clientMessage = "Can't Allocate Leaves";
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