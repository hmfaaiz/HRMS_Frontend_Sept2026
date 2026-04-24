import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { travelrequestApprovalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = travelrequestApprovalSlice;

export const fetchTravelApprovalRequests = (queryParams, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllTravelApprovalRequests({
        ...queryParams,
        ...queryParams.filter,
        employeeId,
      })
      .then((response) => {
        dispatch(actions.travelApprovalRequestsFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Travel Approval Requests";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
        toast.error("Failed to fetch travel approval requests");
      });
  } else {
    dispatch(actions.travelApprovalRequestsFetched({}));
  }
};

export const fetchTravelApprovalRequest = (parentRecordId) => async (
  dispatch,
) => {
  if (!parentRecordId) {
    return dispatch(actions.travelRequestFetched({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getTravelRequestApprovalById(parentRecordId) // Send parentRecordId
    .then((response) => {
      console.log("📡 Full API Response:", response); // Add this debug

      const rawData =
        response.data?.data?.requestData || response.data?.requestData;
      console.log("📦 RawData:", rawData); // Add this debug
      console.log("🆔 RawData Id:", rawData?.Id); // Add this debug
      console.log("🔄 Workflow Id:", rawData?.Workflow?.Id); // Add this debug
      const approvalTimeline =
        response.data?.data?.approvalTimeline ||
        response.data?.approvalTimeline ||
        [];

      if (approvalTimeline.length > 0) {
        dispatch(actions.travelWorkflowStatusFetched(approvalTimeline));
      }

      const data = {
        ...rawData,
        authorityStatus: rawData?.Workflow?.authorityStatus,
        authorityRemarks: rawData?.Workflow?.authorityRemarks,
        workflowId: rawData?.Workflow?.Id, // Keep workflow status Id for approval submission
      };

      console.log("✅ Final data with correct Id:", data); // Add this debug
      console.log("🆔 Final data.Id:", data.Id); // Add this debug

      dispatch(actions.travelRequestFetched({ userForEdit: data }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Travel Approval Request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error("Failed to fetch travel approval request");
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
    .getTravelRequestApprovalWorkflowById(workflowId) // Use the new workflow-based fetch
    .then((response) => {
      console.log("📡 Full API Response (Workflow):", response);

      const rawData =
        response.data?.data?.requestData || response.data?.requestData;
      console.log("📦 RawData (Workflow):", rawData);
      
      const approvalTimeline =
        response.data?.data?.approvalTimeline ||
        response.data?.approvalTimeline ||
        [];

      if (approvalTimeline.length > 0) {
        dispatch(actions.travelWorkflowStatusFetched(approvalTimeline));
      }

      const data = {
        ...rawData,
        authorityStatus: rawData?.Workflow?.authorityStatus,
        authorityRemarks: rawData?.Workflow?.authorityRemarks,
        workflowId: rawData?.Workflow?.Id,
      };

      console.log("✅ Final data (Workflow):", data);

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
      dispatch(actions.travelRequestHandled(payload));
      toast.success(SERVER_MESSAGES.processSuccessful);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Travel Request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};

export const fetchTravelWorkflowStatus = (parentRecordId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  if (parentRecordId) {
    return requestFromServer
      .getTravelRequestApprovalById(parentRecordId) // Send parentRecordId
      .then((response) => {
        const timeline =
          response.data?.data?.approvalTimeline ||
          response.data?.approvalTimeline ||
          [];
        const record =
          response.data?.data?.requestData || response.data?.requestData;

        dispatch(actions.travelWorkflowStatusFetched(timeline));
        if (record) {
          dispatch(actions.travelWorkflowRecordFetched(record));
        }
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
        toast.error("Failed to fetch workflow status");
      });
  } else {
    dispatch(actions.travelWorkflowStatusFetched([]));
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
