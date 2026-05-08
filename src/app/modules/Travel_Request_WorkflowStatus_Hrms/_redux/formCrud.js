import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllTravelApproval(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status_approval/read-all-travel-request-workflow-status-approval`,
    body,
  );
}
export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/travel_request_workflow_status_approval/read-travel-request-workflow-status-approval/${id}`,
  );
}

// Fetch a single travel request via workflow ID (for the approval form)
export async function getTravelRequestWorkflowById(id) {
  return axios.get(
    `${USERS_URL}/travel_request_workflow_status_approval/read-travel-request-workflow-status-approval-mirror/${id}`,
  );
}

// Handle approval / rejection via HRMS endpoint
export async function handleTravelRequestApproval(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status_approval/handle-travel-request-approval`,
    body,
  );
}

// Fetch TADA policy / entitlement for an employee
export async function getTadaConfigurationPolicies(employeeId) {
  return axios.post(
    `${USERS_URL}/t_preapproval_travel_request/read-tada-configuration-policies`,
    {
      employeeId,
    },
  );
}
