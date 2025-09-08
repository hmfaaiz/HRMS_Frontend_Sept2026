import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllLeaveApproval(body) {
  return axios.post(
    `${USERS_URL}/leave_workflow/read-all-leave-approval-workflow`,
    body
  );
}

export async function getAllLeaveBalances(body) {
  return axios.post(
    `${USERS_URL}/leave_request/read-all-employee-leave-balance`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/leave_workflow/read-leave-approval-workflow/${id}`);
}

export function handleLeaveRequest(body) {
  return axios.post(
    `${USERS_URL}/leave_workflow/handle-leave-application`,
    body
  );
}
