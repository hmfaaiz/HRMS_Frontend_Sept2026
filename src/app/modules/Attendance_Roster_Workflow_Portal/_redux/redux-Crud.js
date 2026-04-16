import axios from "axios";
export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body,
  );
}

export async function getAllRosterApproval(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_workflow_status_portal/read-all-attendance-roster-workflow-status-portal`,
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/attendance_roster_workflow_status_portal/read-attendance-roster-workflow-status-portal/${id}`,
  );
}

export function handleRosterRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance_roster_workflow_status_portal/handle-attendance-roster-workflow-status-portal`,
    body,
  );
}
