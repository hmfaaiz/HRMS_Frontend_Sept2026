import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

export async function getAllLeaveApproval(body) {
  return axios.post(
    `${USERS_URL}/leave-approval/read-all-leave-approval`,
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
  return axios.get(`${USERS_URL}/leave-approval/read-leave-approval/${id}`);
}

export function handleLeaveRequest(body) {
  return axios.post(
    `${USERS_URL}/leave-approval/handle-leave-application`,
    body
  );
}

export function getLeaveApplicationSetupById(id) {
  return axios.get(`${USERS_URL}/leave_request/read-leave-application/${id}`);
}

export function updateLeaveApplicationSetup(body) {
  return axios.put(`${USERS_URL}/leave_request/update-leave-application`, body);
}

export function deleteLeaveApplicationSetup(id) {
  return axios.delete(
    `${USERS_URL}/leave_application/delete-leave-application/${id}`
  );
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
