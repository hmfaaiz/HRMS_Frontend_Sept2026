import * as requestFromServer from "./formCrud";
import { AllocateLeavesSlice, callTypes } from "./AllocateLeavesSlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = AllocateLeavesSlice;

/**
 * 
 * Fetch All Allocate Leaves Data from the server according to filters provided in body
 * 
 * @param {Object} body 
 * @returns 
 */
export const fetchAllocateLeaves = (body) => async (dispatch) => {
  if (!(body.subsidiaryId && body.cycleTypeId && body.yearId)) {
    return dispatch(actions.AllocateLeavesFetched({ ...body, list: [] }));
  }
  return requestFromServer.getAllAllocateLeavesSetup(body)
    .then((response) => {
      const AllocateLeavesData = response.data?.data;
      dispatch(actions.AllocateLeavesFetched(AllocateLeavesData));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Allocate Leavess";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * Fetch All Policy Dropdown Data
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchPolicyData = () => async (dispatch) => {
  return requestFromServer.getPolicyDropdownData()
    .then((response) => {
      dispatch(actions.policyDropdownFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Allocate Leavess";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * Save Allocate Leaves Record
 * 
 * @param {Object} data 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.createAllocateLeavesSetup(data)
    .then((res) => {
      const AllocateLeavesData = res.data?.data;
      if (AllocateLeavesData) {
        dispatch(actions.AllocateLeavesCreated(AllocateLeavesData));
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
      error.clientMessage = "Can't Create Allocate Leaves";
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