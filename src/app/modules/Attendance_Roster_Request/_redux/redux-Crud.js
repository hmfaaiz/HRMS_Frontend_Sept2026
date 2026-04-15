import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;
export function createRosterRequest(body) {
  return axios.post(`${USERS_URL}/attendance_roster_request/create-attendance-roster-request`, body);
}

export function getAllRosterRequests(body) {
  return axios.post(`${USERS_URL}/attendance_roster_request/read-all-attendance-roster-request`, body);
}

export function getRosterRequestById(id) {
  return axios.get(`${USERS_URL}/attendance_roster_request/read-attendance-roster-request/${id}`);
}

export function updateRosterRequest(body) {
  return axios.put(`${USERS_URL}/attendance_roster_request/update-attendance-roster-request`, body);
}

// export function deleteRosterRequest(id) {
//   return axios.delete(`${BASE_URL}/attendance_roster_request/delete-attendance-roster-request/${id}`);
// }

export function approveRosterRequest(body) {
  return axios.put(`${USERS_URL}/attendance_roster_request/approve-attendance-roster-request`, body);
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
