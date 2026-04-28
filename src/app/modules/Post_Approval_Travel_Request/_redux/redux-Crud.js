import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

export function getApprovedTravelRequestsByEmployee() {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/read-all-post-approval-travel-request`,
    {},
  );
}

// Create
export function createPostApprovalTravelRequest(body) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/create-post-approval-travel-request`,
    body,
  );
}

// Read All (paginated table)
export function getAllPostApprovalTravelRequests(body) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/read-all-post-approval-records`,
    body,
  );
}

// Read One
export function getPostApprovalTravelRequestById(Id) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/read-post-approval-travel-request`,
    { Id },
  );
}

// Update
export function updatePostApprovalTravelRequest(body) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/update-post-approval-travel-request`,
    body,
  );
}

// Delete
export function deletePostApprovalTravelRequest(Id) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/delete-post-approval-travel-request`,
    { Id },
  );
}
export function getAllReimbursementConfigPolicy(body) {
 

  return axios.post(`${BASE_URL}/reimbursement_claim/read-reimbursement-configuration-policies`, body);

  
}

export function uploadImage(body) {
  return axios.post(`${BASE_URL}/file-upload`, body);
}

export function checkCanApprove(Id) {
  return axios.post(
    `${BASE_URL}/post_approval_travel_request/can-approve-post-approval-request`,
    { Id },
  );
}