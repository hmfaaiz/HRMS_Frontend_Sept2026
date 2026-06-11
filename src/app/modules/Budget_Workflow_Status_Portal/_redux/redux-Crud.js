import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllBudgetApproval(body) {
  return axios.post(
    `${USERS_URL}/budget_workflow_status_portal/read-all-budget-workflow-status-portal`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/budget_workflow_status_portal/read-budget-workflow-status-portal/${id}`
  );
}

export function handleBudgetRequest(body) {
  return axios.post(
    `${USERS_URL}/budget_workflow_status_portal/handle-budget-workflow-status-portal`,
    body
  );
}