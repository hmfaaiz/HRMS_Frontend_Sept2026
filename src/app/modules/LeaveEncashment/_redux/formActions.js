import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { LeaveEncashmentSlice, callTypes } from "./LeaveEncashmentSlice";
import { toast } from "react-toastify";
const { actions } = LeaveEncashmentSlice;

/**
 * 
 * Fetch All Leave Encashment Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchLeaveEncashment = (queryparm, employeeId, yearId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId && yearId) {
    return requestFromServer.getAllLeaveEncashmentSetup({ ...queryparm, employeeId, yearId })
      .then((response) => {
        dispatch(actions.LeaveEncashmentFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Encashments";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
  else {
    dispatch(actions.LeaveEncashmentFetched({}));
  }

};

/**
 * 
 * Fetch All Leave Encashment by Employee Id from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchLeaveBalances = (employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer.getAllLeaveBalances({ employeeId })
      .then((response) => {
        dispatch(actions.LeaveBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Balances";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
  else {
    dispatch(actions.LeaveBalancesFetched([]));
  }

};

/**
 * 
 * Fetch Single Leave Encashment Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.LeaveEncashmentFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getLeaveEncashmentSetupById(id)
    .then((response) => {

      const entities = response.data?.data;
      dispatch(actions.LeaveEncashmentFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Encashment";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Save or update Leave Encashment Record
 * 
 * @param {Object} data 
 * @param {String|Number|Null} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, employeeId, yearId, disableLoading, resetForm) => (dispatch) => {
  if (employeeId && yearId) {
    if (!data.Id) {
      return requestFromServer.createLeaveEncashmentSetup({ ...data, employeeId, yearId })
        .then((res) => {
          const LeaveEncashmentData = res.data?.data;
          if (LeaveEncashmentData) {
            dispatch(actions.LeaveEncashmentCreated(LeaveEncashmentData));
            disableLoading();
            dispatch(fetchLeaveBalances(employeeId))
            resetForm()
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
          error.clientMessage = "Can't Create Leave Encashment";
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
      const body = { ...data };
      delete body.fileName;
      return requestFromServer.updateLeaveEncashmentSetup(body)
        .then((res) => {
          const LeaveEncashmentData = res.data?.data;
          if (LeaveEncashmentData) {
            dispatch(actions.LeaveEncashmentUpdated(LeaveEncashmentData));
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
          }
        })
        .catch((error) => {
          disableLoading();
          error.clientMessage = "Can't Update Leave Encashment";
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
  }

};

/**
 * 
 * Delete Single Leave Encashment Record By Id
 * 
 * @param {String|Number} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.deleteLeaveEncashmentSetup(id)
    .then((res) => {
      dispatch(actions.LeaveEncashmentDeleted({ id }));
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
      error.clientMessage = "Can't Delete Leave Encashment";
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


export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  }
  else {
    return requestFromServer.getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
}