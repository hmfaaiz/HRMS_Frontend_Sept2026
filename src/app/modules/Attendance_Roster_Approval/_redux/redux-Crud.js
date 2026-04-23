import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllRosterApproval(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_approval/read-all-attendance-roster-approval`,
    body
  );
}

export async function getWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/attendance_roster_approval/read-attendance-roster-approval/${id}`
  );
}

export function handleRosterApprovalRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_approval/handle-attendance-roster-approval`,
    body
  );
}