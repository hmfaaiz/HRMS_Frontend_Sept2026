import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

export function getApprovedTravelRequestsByEmployee() {
  return axios.post(
    `${BASE_URL}/post_travel_request/read-all-post-approval-travel-request-portal`,
    {},
  );
}

// Create
export function createPostTravelRequestPortal(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request/create-post-approval-travel-request-portal`,
    body,
  );
}

// Read All (paginated table)
export function getAllPostTravelRequestPortals(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request/read-all-post-approval-records-portal`,
    body,
  );
}

// Read One
export function getPostTravelRequestPortalById(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request/read-post-approval-travel-request-portal`,
    { Id },
  );
}
//not being used in this module just kept it if required in future
// Update
export function updatePostTravelRequestPortal(body) {
  return axios.post(
    `${BASE_URL}/post_travel_request/update-post-approval-travel-request-portal`,
    body,
  );
}
//not being used in this module just kept it if required in future
// Delete
export function deletePostTravelRequestPortal(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request/delete-post-approval-travel-request-portal`,
    { Id },
  );
}
export function getAllReimbursementConfigPolicy(body) {



  return axios.post(`${BASE_URL}/reimbursement_claim/read-reimbursement-configuration-policies`, body);


}

export function uploadImage(body) {
  return axios.post(`${BASE_URL}/file-upload`, body);
}

//not being used in this module just kept it if required in future
export function checkCanApprove(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request/can-approve-post-approval-request-portal`,
    { Id },
  );
}

export function getPostTravelRequestPortalReport(Id) {
  return axios.post(
    `${BASE_URL}/post_travel_request/post-approval-travel-request-report-portal`,
    { Id },
    { responseType: "arraybuffer" },
  );
}