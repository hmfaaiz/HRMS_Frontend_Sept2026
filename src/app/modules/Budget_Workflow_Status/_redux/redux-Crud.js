import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllBudgetWorkflow(body) {
  return axios.post(
    `${USERS_URL}/budget_workflow_status/read-all-budget-workflow-status`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/budget_workflow_status/read-budget-workflow-status/${id}`
  );
}

export function handleBudgetWorkflowRequest(body) {
  return axios.post(
    `${USERS_URL}/budget_workflow_status/handle-budget-workflow-status`,
    body
  );
}