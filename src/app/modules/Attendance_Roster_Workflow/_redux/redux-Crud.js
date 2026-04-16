import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllRosterWorkflow(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_workflow_status/read-all-attendance-roster-workflow-status`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/attendance_roster_workflow_status/read-attendance-roster-workflow-status/${id}`
  );
}

export function handleRosterWorkflowRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_workflow_status/handle-attendance-roster-workflow-status`,
    body
  );
}