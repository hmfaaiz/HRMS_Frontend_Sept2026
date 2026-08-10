import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

export function uploadImage(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

export function createLeaveApplicationSetup(body) {
  return axios.post(`${USERS_URL}/leave_request/create-leave-request`, body);
}

export async function getAllLeaveApplicationSetup(body) {
  return axios.post(
    `${USERS_URL}/leave_request/read-all-leave-application`,
    body
  );
}

export async function getAllLeaveBalances(body) {
  return axios.post(
    `${USERS_URL}/leave_request/read-all-employee-leave-balance-with-unpaid`,
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

export function getSandwichPolicy(subsidiaryId) {
  return axios.get(
    `${USERS_URL}/leave_application/read-sandwich-policy/${subsidiaryId}`
  );
}

export function getLeaveApplicationDetail(body) {
  return axios.post(
    `${USERS_URL}/leave_request/get-leave-application-detail`,
    body
  );
}
export function getWorkflowStatusByLeaveId(leaveId) {
  return axios.get(
    `${USERS_URL}/leave-approval/read-leave-approval/${leaveId}`
  );
}

export function uploadFormDoc(body) {
  return axios.post(`${USERS_URL}/leave-approval/document-upload`, body);
}
