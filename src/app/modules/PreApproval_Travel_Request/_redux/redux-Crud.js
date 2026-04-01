import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

// Create
export function createPreApprovalTravelRequest(body) {
  return axios.post(`${BASE_URL}/t_preapproval_travel_request/create-preapproval-travel-request`, body);
}

// Read All
export function getAllPreApprovalTravelRequest(body) {
  return axios.post(`${BASE_URL}/t_preapproval_travel_request/read-all-preapproval-travel-request`, body);
}

// Read One
export function getPreApprovalTravelRequestById(id) {
  return axios.post(`${BASE_URL}/t_preapproval_travel_request/read-preapproval-travel-request`, { id });
}

// Update
export function updatePreApprovalTravelRequest(body) {
  return axios.post(`${BASE_URL}/t_preapproval_travel_request/update-preapproval-travel-request`, body);
}

// Delete
export function deletePreApprovalTravelRequest(id) {
  return axios.post(`${BASE_URL}/t_preapproval_travel_request/delete-preapproval-travel-request`, { id });
}
