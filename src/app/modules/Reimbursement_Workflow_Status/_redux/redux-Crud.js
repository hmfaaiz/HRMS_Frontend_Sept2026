import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllReimbursementWorkflow(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_workflow_status_approval/read-all-reimbursement-claim-workflow-status-approval`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/reimbursement_claim_workflow_status_approval/read-reimbursement-claim-workflow-status-approval/${id}`
  );
}

export function handleReimbursementWorkflowRequest(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_workflow_status_approval/handle-reimbursement-claim-workflow-status-approval`,
    body
  );
}