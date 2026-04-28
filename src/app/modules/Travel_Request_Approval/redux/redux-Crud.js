import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

// Read all travel requests for approval (filter by status)
export function getAllTravelApprovalRequests(body) {
  return axios.post(
    `${BASE_URL}/travel_request_approval/read-all-travel-request-approval`,
    body,
  );
}

// Get by ID (Workflow Timeline)
export function getTravelRequestApprovalById(id) {
  return axios.get(
    `${BASE_URL}/travel_request_approval/read-travel-request-approval/${id}`,
  );
}

// Get by Workflow ID
export function getTravelRequestApprovalWorkflowById(id) {
  return axios.get(
    `${BASE_URL}/travel_request_approval/read-travel-request-approval-workflow/${id}`,
  );
}

// Handle approval/rejection
export function handleTravelRequestApproval(body) {
  return axios.post(
    `${BASE_URL}/travel_request_approval/handle-travel-request-approval`,
    body,
  );
}

// Fetch TADA configurations by employeeId
export function getTadaConfigurationPolicies(employeeId) {
  return axios.post(
    `${BASE_URL}/t_preapproval_travel_request/read-tada-configuration-policies`,
    {
      employeeId,
    },
  );
}
