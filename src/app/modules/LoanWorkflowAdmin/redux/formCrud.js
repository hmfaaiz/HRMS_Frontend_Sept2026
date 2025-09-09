import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllLoanApproval(body) {
  return axios.post(
    `${USERS_URL}/loan_workflow/read-all-loan-approval-workflow`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/loan_workflow/read-loan-approval-workflow/${id}`);
}

export function handleLoanRequest(body) {
  return axios.post(
    `${USERS_URL}/loan_workflow/handle-loan-application`,
    body
  );
}

