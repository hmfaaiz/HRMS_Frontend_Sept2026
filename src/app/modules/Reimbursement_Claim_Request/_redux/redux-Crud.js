import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function uploadImage(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

export function createReimbursementClaim(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_request/create-reimbursement-claim-request`,
    body
  );
}

export function getAllReimbursementClaim(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_request/read-all-reimbursement-claim-request`,
    body
  );
}

export function getReimbursementClaimById(id) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim_request/read-reimbursement-claim-request`,
    id
  );
}

export function updateReimbursementClaim(body) {
  return axios.put(
    `${USERS_URL}/reimbursement_claim_request/resubmit-reimbursement-claim`,
    body
  );
}

export function deleteReimbursementClaim(body) {
  return axios.patch(
    `${USERS_URL}/reimbursement_claim_request/delete-reimbursement-claim`,
    body
  );
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

// ── Reimbursement config policies (for amount limit) ──────────────────────────
export function getAllReimbursementConfigPolicy(body) {
  return axios.post(
    `${USERS_URL}/reimbursement_claim/read-reimbursement-configuration-policies`,
    body
  );
}