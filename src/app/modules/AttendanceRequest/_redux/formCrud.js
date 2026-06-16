import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function createAttendanceRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance_request/create-attendance-request`,
    body
  );
}

export function getAttendanceSetupById(id) {
  return axios.get(`${USERS_URL}/attendance_request/read-attendance/${id}`);
}


export async function getAllAttendanceSetup(body) {
  return axios.post(
    `${USERS_URL}/attendance_request/read-all-attendance-request`,
    body
  );
}

export function getAttendanceSheetConsolidated(body) {
  return axios.post(`${USERS_URL}/attendance_request/attendance-summary`, body);
}

export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}
export async function getWorkflowStatusByAttendanceId(id) {
  return axios.get(
    `${USERS_URL}/attendance_workflow/read-attendance-approval-workflow/${id}`
  );
}