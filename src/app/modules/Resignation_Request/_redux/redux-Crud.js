import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function updateResignation(body) {
  return axios.post(
    `${USERS_URL}/employee_resignation/update-employee-resignation`,
    body
  );
}

export function getResignation() {
  return axios.get(`${USERS_URL}/employee_resignation/read-all-resignation`);
}


export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}