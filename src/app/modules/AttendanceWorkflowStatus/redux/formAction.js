import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { AttendanceWorkflowStatusSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = AttendanceWorkflowStatusSlice;

export const fetchAttendanceApprovalApplication = (
  queryparm,
  employeeId
) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  try {
    if (employeeId) {
      const response = await requestFromServer.getAllAttendanceApproval({
        ...queryparm,
        employeeId,
      });

      // Normalize so reducer always gets the same structure
      const normalizedResponse = {
        data: {
          data: {
            rows: Array.isArray(response?.data?.data?.rows)
              ? response.data.data.rows
              : [],
            totalResults: Number(response?.data?.data?.totalResults) || 0,
          },
        },
      };

      dispatch(actions.LeaveApprovalApplicationFetched(normalizedResponse));
    } else {
      // Empty array fallback with the same structure as API success
      dispatch(
        actions.LeaveApplicationFetched({
          data: { data: { rows: [], totalResults: 0 } },
        })
      );
    }
  } catch (error) {
    error.clientMessage = "Can't find Leave Data";
    dispatch(actions.catchError({ error, callType: callTypes.list }));
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
