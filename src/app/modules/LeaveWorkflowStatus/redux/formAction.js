import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { LeaveWorkflowStatusSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = LeaveWorkflowStatusSlice;

export const fetchLeaveApprovalApplication = (queryparm, employeeId) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllLeaveApproval({ ...queryparm, employeeId })
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

export const fetchLeaveBalances = (employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (employeeId) {
    return requestFromServer
      .getAllLeaveBalances({ employeeId })
      .then((response) => {
        dispatch(actions.LeaveBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Balances";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
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

// export const getEmployeeHierarchy = (level) => (dispatch) => {
//   return requestFromServer
//     .getEmployeeHierarchy(level)
//     .then((res) => {
//       const { levelList, employeeList } = res.data?.data;
//       dispatch(
//         actions.EmployeeLeaveHierarchyFetched({ levelList, employeeList })
//       );
//     })
//     .catch((error) => {
//       dispatch(
//         actions.EmployeeLeaveHierarchyFetched({ employeeHierarchy: [] })
//       );
//       error.clientMessage = "Can't Get Employee Hierarchy";
//     });
// };

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "399")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};

export const fetchLeaveWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.LeaveWorkflowStatusFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
  }
};

export const handleLeaveRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleLeaveRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Leave Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
