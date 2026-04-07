import axios from "axios";
export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}


export async function getAllReimbursementApproval(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_workflow_status/read-all-reimbursement-claim-workflow-status`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/reimbursement_claim_workflow_status/read-reimbursement-claim-workflow-status/${id}`
  );
}

export function handleReimbursementRequest(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_workflow_status/handle-reimbursement-claim-workflow-status`,
    body
  );
}