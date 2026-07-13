import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { AttendanceApprovalSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = AttendanceApprovalSlice;

export const fetchAttendanceApprovalApplication = (
  queryparm,
  employeeId,
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllAttendanceApproval({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.LeaveApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.LeaveApplicationFetched({}));
  }
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

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "400")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};

export const fetchAttendanceWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.LeaveWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveWorkflowStatusFetched([]));
  }
};

export const handleAttendanceRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleAttendanceRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Attendance Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};

export const getAttendanceRequestData = (Id, onHide) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAttendanceRequset(Id)
    .then((res) => {
      dispatch(actions.AttDetailFetched(res?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Fetch Attendance Request";
      toast.error("Can't Fetch Attendance Request");
      onHide();
    });
};

export const updateAttendanceRequestData = (body, disbaleLoading, onHide) => (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateAttendanceRequset(body)
    .then((res) => {
      dispatch(actions.AttDetailUpdate());
      disbaleLoading(false);
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't Update Attendance Request";
      toast.error(error?.message || "Can't Update Attendance Request");
      disbaleLoading();
    });
};
