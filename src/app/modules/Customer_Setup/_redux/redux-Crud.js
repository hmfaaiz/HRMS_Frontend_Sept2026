import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Customer
export function createCustomer(body) {
  return axios.post(`${API_URL}/customer_setup/create-customer-setup`, body);
}

// Get All Customers
export function getAllCustomers(body) {
  return axios.post(`${API_URL}/customer_setup/read-all-customer-setup`, body);
}

// Get Customer by ID
export function getCustomerById(body) {
  return axios.post(`${API_URL}/customer_setup/read-customer-setup`, body);
}

// Update Customer
export function updateCustomer(body) {
  return axios.put(`${API_URL}/customer_setup/update-customer-setup`, body);
}

// Delete Customer
export function deleteCustomer(body) {
  return axios.patch(`${API_URL}/customer_setup/delete-customer-setup`, body);
}
