import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllReimbursementApproval(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_approval/read-all-reimbursement-claim-approval`,
    body
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/reimbursement_claim_approval/read-reimbursement-claim-approval/${id}`
  );
}

export function handleReimbursementApprovalRequest(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_approval/handle-reimbursement-claim-approval`,
    body
  );
}