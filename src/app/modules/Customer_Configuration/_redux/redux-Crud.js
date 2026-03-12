import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create CustomerConfigs
export function createCustomerConfigs(body) {
  return axios.post(`${API_URL}/customer_config/create-customer-config`, body);
}

// Get All CustomerConfigs
export function getAllCustomerConfigs(body) {
  return axios.post(
    `${API_URL}/customer_config/read-all-customer-config`,
    body,
  );
}

// Get CustomerConfigs by ID
export function getCustomerConfigsById(body) {
  return axios.post(`${API_URL}/customer_config/read-customer-config`, body);
}

// Update CustomerConfigs
export function updateCustomerConfigs(body) {
  return axios.put(`${API_URL}/customer_config/update-customer-config`, body);
}

// Delete CustomerConfigs
export function deleteCustomerConfigs(body) {
  return axios.patch(`${API_URL}/customer_config/delete-customer-config`, body);
}

export function customerEpicTicket(body) {
  return axios.post(`${API_URL}/customer_config/customer-epic-ticket`, body);
}

export function createdCustomerIds() {
  return axios.get(`${API_URL}/customer_config/customer-config-created`);
}
