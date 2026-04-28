import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllTravelApproval(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status_approval/read-all-travel-request-workflow-status-approval`,
    body,
  );
}

export async function getAllTravelBalances(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status_approval/read-all-employee-leave-balance`, // Keeping this if it's used for some reason, but usually travel doesn't have "balances" like leave.
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/travel_request_workflow_status_approval/read-travel-request-approval-workflow/${id}`,
  );
}

export function handleTravelRequest(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status_approval/handle-travel-request-approval`,
    body,
  );
}
