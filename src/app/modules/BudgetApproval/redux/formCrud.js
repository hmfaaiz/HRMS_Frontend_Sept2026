import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;



export async function getAllBudgetApproval(body) {
  return axios.post(
    `${USERS_URL}/department_wise_budget_approval/read-all-budget-approval`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/department_wise_budget_approval/read-budget-approval/${id}`);
}

export function handleBudgetRequest(body) {
  return axios.post(
    `${USERS_URL}/department_wise_budget_approval/handle-budget-application`,
    body
  );
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
