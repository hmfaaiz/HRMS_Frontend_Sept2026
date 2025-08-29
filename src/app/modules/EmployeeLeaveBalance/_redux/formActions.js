import * as requestFromServer from "./formCrud";
import { EmployeeLeaveBalanceSlice, callTypes } from "./EmployeeLeaveBalanceSlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = EmployeeLeaveBalanceSlice;

/**
 * 
 * Fetch All Employee Leave Balance from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchEmployeeLeaveBalance = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllEmployeeLeaveBalanceSetup(queryparm)
    .then((response) => {
      dispatch(actions.EmployeeLeaveBalanceFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Employee Leave Balances";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * Fetch Single Employee Leave Balance Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchEditRecord = (data) => (dispatch) => {
  if (!(data.employeeId && data.leaveType && data.yearId)) {
    return dispatch(actions.EmployeeLeaveBalanceFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmployeeLeaveBalanceSetupByFilters(data)
    .then((response) => {

      const entities = response.data?.data;
      dispatch(actions.EmployeeLeaveBalanceFetchedForEdit(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Employee Leave Balance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Save Employee Leave Balance Record
 * 
 * @param {Object} data 
 * @param {Function} disableLoading 
 * @returns 
 */
export const saveRecord = (data, disableLoading) => (dispatch) => {
    return requestFromServer.createEmployeeLeaveBalanceSetup(data)
      .then((res) => {
        const EmployeeLeaveBalanceData = res.data?.data;
        if (EmployeeLeaveBalanceData) {
          dispatch(actions.EmployeeLeaveBalanceCreated(EmployeeLeaveBalanceData));
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
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Create Employee Leave Balance";
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
