import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { TravelRequestWorkflowStatusSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
const { actions } = TravelRequestWorkflowStatusSlice;

export const fetchTravelWorkflowStatus = (queryparm, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllTravelWorkflowStatus({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.TravelApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Travel Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.TravelApprovalApplicationFetched({ data: { data: { rows: [], totalResults: 0 } } }));
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
    .getEmployeeAuthorties(empId, "628")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};

export const fetchTravelWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.TravelWorkflowStatusFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    // dispatch(actions.LeaveBalancesFetched([]));
  }
};

export const fetchTadaConfigByEmployeeId = (employeeId) => (dispatch) => {
  dispatch(actions.employeeEntitlementFetched({ employeeEntitlement: null }));

  if (!employeeId) {
    return;
  }

  return requestFromServer
    .getTadaConfigurationPolicies(employeeId)
    .then((response) => {
      const entities = response.data?.data || response.data;
      dispatch(
        actions.employeeEntitlementFetched({ employeeEntitlement: entities }),
      );
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      dispatch(
        actions.employeeEntitlementFetched({ employeeEntitlement: null }),
      );
      toast.error(
        error?.response?.data?.message ||
          "TADA Policy not defined for this employee",
      );
    });
};
