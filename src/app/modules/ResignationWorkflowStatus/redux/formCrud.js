import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllResignationApproval(body) {
  return axios.post(
    `${USERS_URL}/resignation_approval/read-all-resignation-approval`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/resignation_approval/read-resignation-approval/${id}`);
}

export function handleResignationRequest(body) {
  return axios.post(
    `${USERS_URL}/resignation_approval/handle-resignation-application`,
    body
  );
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
