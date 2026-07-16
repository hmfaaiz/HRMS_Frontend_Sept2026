import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body,
  );
}

export async function getAllAttendanceApproval(body) {
  return axios.post(
    `${USERS_URL}/attendance-approval/read-all-attendance-approval`,
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/attendance-approval/read-attendance-approval/${id}`,
  );
}

export function handleAttendanceRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance-approval/handle-attendance-application`,
    body,
  );
}

export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`,
  );
}

export function getAttendanceRequset(Id) {
  return axios.get(
    `${USERS_URL}/attendance-approval/read-attendance-request-approval/${Id}`,
  );
}

export function updateAttendanceRequset(body) {
  return axios.post(
    `${USERS_URL}/attendance-approval/update-attendance-approval`,
    body,
  );
}
