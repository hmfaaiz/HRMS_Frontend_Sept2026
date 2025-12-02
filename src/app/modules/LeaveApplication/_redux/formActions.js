import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { LeaveApplicationSlice, callTypes } from "./LeaveApplicationSlice";
import { toast } from "react-toastify";
const { actions } = LeaveApplicationSlice;

/**
 *
 * Fetch All Leave Application Paginated from the server
 *
 * @param {Object} queryparm
 * @returns
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer
    .uploadImage(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      error.clientMessage = "File not Uploaded";
      // dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 *
 * Fetch All Leave Application Paginated from the server
 *
 * @param {Object} queryparm
 * @returns
 */
export const fetchLeaveApplication = (queryparm, employeeId) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllLeaveApplicationSetup({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.LeaveApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Applications";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.LeaveApplicationFetched({}));
  }
};

export const fetchLeaveDetail = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.detail_list }));
  return requestFromServer
    .getleaveDetail(id)
    .then((response) => {
      dispatch(actions.LeaveDetailFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Detail";
      dispatch(actions.catchError({ error, callType: callTypes.detail_list }));
    });
};

export const updateLeaveDetail = (body, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.detail_action }));
  return requestFromServer
    .updateleaveDetail(body)
    .then((response) => {
      dispatch(actions.LeaveDetailUpdated({}));
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
      error.clientMessage = "Can't Update Leave Detail";
      dispatch(
        actions.catchError({ error, callType: callTypes.detail_action })
      );
    });
};

/**
 *
 * Fetch All Leave Application by Employee Id from the server
 *
 * @param {Object} queryparm
 * @returns
 */
export const fetchLeaveBalances = (employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllLeaveBalances({ employeeId })
      .then((response) => {
        dispatch(actions.LeaveBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Balances";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
  }
};

/**
 *
 * Fetch Single Leave Application Record by Id
 *
 * @param {string|number} id
 * @returns
 */
export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.LeaveApplicationFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getLeaveApplicationSetupById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(
        actions.LeaveApplicationFetchedForEdit({ userForEdit: entities })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Application";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 *
 * Save or update Leave Application Record
 *
 * @param {Object} data
 * @param {String|Number|Null} id
 * @param {Function} disableLoading
 * @param {Function} onHide
 * @returns
 */
export const saveRecord = (data, employeeId, disableLoading, resetForm) => (
  dispatch
) => {
  if (employeeId) {
    if (!data.Id) {
      return requestFromServer
        .createLeaveApplicationSetup({ ...data, employeeId })
        .then((res) => {
          const LeaveApplicationData = res.data?.data;
          if (LeaveApplicationData) {
            dispatch(actions.LeaveApplicationCreated(LeaveApplicationData));
            disableLoading();
            resetForm();
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
          error.clientMessage = "Can't Create Leave Application";
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
    } else {
      const body = { ...data };
      delete body.fileName;
      return requestFromServer
        .updateLeaveApplicationSetup(body)
        .then((res) => {
          const LeaveApplicationData = res.data?.data;
          if (LeaveApplicationData) {
            dispatch(actions.LeaveApplicationUpdated(LeaveApplicationData));
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
          error.clientMessage = "Can't Update Leave Application";
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

export const getLeaveApplicationDetail = (
  data,
  employeeId,
  disableLoading,
) => (dispatch) => {
  if (employeeId) {
    return requestFromServer
      .getLeaveApplicationDetail({ ...data, employeeId })
      .then((res) => {
        const LeaveApplicationData = res.data?.data;
        if (LeaveApplicationData) {
          dispatch(
            actions.LeaveApplicationFetchedForEdit({ userForEdit: LeaveApplicationData })
          );
          disableLoading();
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Extract Leave Application Detail";
        toast.error(error?.response?.data?.message || error.clientMessage, {
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
 * Delete Single Leave Application Record By Id
 *
 * @param {String|Number} id
 * @param {Function} disableLoading
 * @param {Function} onHide
 * @returns
 */
export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer
    .deleteLeaveApplicationSetup(id)
    .then((res) => {
      dispatch(actions.LeaveApplicationDeleted({ id }));
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
      error.clientMessage = "Can't Delete Leave Application";
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
};

export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  } else {
    return requestFromServer
      .getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
};

export const getSandwichPolicy = (subsidiaryId) => (dispatch) => {
  if (!subsidiaryId) {
    dispatch(actions.SandwichPolicyFetched({ sandwichPolicy: null }));
  } else {
    return requestFromServer
      .getSandwichPolicy(subsidiaryId)
      .then((res) => {
        const sandwichPolicy = res.data?.data;
        dispatch(actions.SandwichPolicyFetched({ sandwichPolicy }));
      })
      .catch((error) => {
        dispatch(actions.SandwichPolicyFetched({ sandwichPolicy: null }));
        error.clientMessage = "Can't Get Sandwich Policy";
      });
  }
};
