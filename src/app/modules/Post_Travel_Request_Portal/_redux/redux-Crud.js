import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

export function getApprovedTravelRequestsByEmployee() {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/read-all-post-approval-travel-request`,
    {},
  );
}

// Create
export function createPostTravelRequestPortal(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/create-post-approval-travel-request`,
    body,
  );
}

// Read All (paginated table)
export function getAllPostTravelRequestPortals(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/read-all-post-approval-records`,
    body,
  );
}

// Read One
export function getPostTravelRequestPortalById(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/read-post-approval-travel-request`,
    { Id },
  );
}

// Update
export function updatePostTravelRequestPortal(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/update-post-approval-travel-request`,
    body,
  );
}

// Delete
export function deletePostTravelRequestPortal(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/delete-post-approval-travel-request`,
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
    `${BASE_URL}/post_travel_request_portal/can-approve-post-approval-request`,
    { Id },
  );
}

export function getPostTravelRequestPortalReport(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request_portal/post-approval-travel-request-report`,
    { Id },
    { responseType: "arraybuffer" },
  );
}