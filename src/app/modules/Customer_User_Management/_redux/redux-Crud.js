import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create CustomerUserMgts
export function createCustomerUserMgts(body) {
  return axios.post(`${API_URL}/customer_user/create-customer-user`, body);
}

// Get All CustomerUserMgts
export function getAllCustomerUserMgts(body) {
  return axios.post(`${API_URL}/customer_user/read-all-customer-user`, body);
}

// Get CustomerUserMgts by ID
export function getCustomerUserMgtsById(body) {
  return axios.post(`${API_URL}/customer_user/read-customer-user`, body);
}

// Update CustomerUserMgts
export function updateCustomerUserMgts(body) {
  return axios.put(`${API_URL}/customer_user/update-customer-user`, body);
}

// Delete CustomerUserMgts
export function deleteCustomerUserMgts(body) {
  return axios.patch(`${API_URL}/customer_user/delete-customer-user`, body);
}

