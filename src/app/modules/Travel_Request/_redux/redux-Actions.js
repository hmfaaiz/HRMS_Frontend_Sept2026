import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { travel_requestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = travel_requestSlice;

export const fetchTravelRequests = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllTravelRequest(queryparm)
    .then((response) => {
      dispatch(actions.travelRequestFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find ";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const createTravelRequest = (
  travelRequestForCreation,
  disbaleLoading,
  onHide,
) => (dispatch) => {
  return requestFromServer
    .createTravelRequest(travelRequestForCreation)
    .then((res) => {
      const user = res.data?.data || res.data;
      dispatch(actions.travelRequestCreated(user));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess);
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
      );
    });
};

export const fetchTadaConfigByEmployeeId = (employeeId, hideToast = false) => (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

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
      if (!hideToast) {
        // toast.error(error?.response?.data?.message || "TADA Policy not defined for this employee");
      }
    });
};

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "628")
    .then((res) => {
      // API returns: { data: { data: [...], isPolicyExists: bool } }
      const data = Array.isArray(res.data?.data?.data)
        ? res.data?.data?.data
        : [];
      const isPolicyExists = res.data?.data?.isPolicyExists || false;
      dispatch(actions.EmployeeAuthorityFetched({ data, isPolicyExists }));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
      // dispatch empty so table shows no records instead of hanging
      dispatch(
        actions.EmployeeAuthorityFetched({ data: [], isPolicyExists: false }),
      );
    });
};
export const fetchTravelRequestWorkflow = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (id) {
    return requestFromServer
      .getWorkflowStatusByParentId(id)
      .then((response) => {
        dispatch(actions.workflowStatusFetched(response.data?.data || []));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.workflowStatusFetched([]));
  }
};