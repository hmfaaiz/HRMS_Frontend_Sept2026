import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { TravelRequestWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = TravelRequestWorkflowAdminSlice;

export const fetchTravelApprovalApplication = (queryparm, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllTravelApproval({ ...queryparm, employeeId })
    .then((response) => {
      let responseData = response?.data?.data;
      let rows = responseData?.rows || [];
      let uniqueData = [
        ...new Map(rows.map((item) => [item.parentRecordId, item])).values(),
      ];
      dispatch(actions.TravelApprovalApplicationFetched({
        entities: uniqueData,
        totalCount: responseData?.totalResults || uniqueData.length,
      }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Travel Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
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
    dispatch(actions.TravelApprovalApplicationFetched({ entities: [], totalCount: 0 }));
  }
};

export const handleTravelRequest = (body, resetForm, setLoading) => () => {
  return requestFromServer
    .handleTravelRequestApproval(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Travel Approval Failed";
      toast.error(error?.response?.data?.message || error?.clientMessage);
      setLoading(false);
    });
};

export const fetchTravelApprovalRequestWorkflow = (workflowId) => async (
  dispatch,
) => {
  if (!workflowId) {
    return dispatch(actions.travelRequestFetched({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getTravelRequestWorkflowById(workflowId)
    .then((response) => {
      const rawData =
        response.data?.data?.requestData || response.data?.requestData;
      
      const data = {
        ...rawData,
        authorityStatus: rawData?.Workflow?.authorityStatus,
        authorityRemarks: rawData?.Workflow?.authorityRemarks,
        workflowId: rawData?.Workflow?.Id,
      };

      dispatch(actions.travelRequestFetched({ userForEdit: data }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Travel Approval Request Workflow";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error("Failed to fetch travel approval request workflow");
    });
};

export const handleTravelRequestApproval = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .handleTravelRequestApproval(payload)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Travel Request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.updatedFail);
    });
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
