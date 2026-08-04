import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

// Create
export function createTadaConfig(body) {
  return axios.post(`${BASE_URL}/tada_config/create-tada-config`, body);
}

// Read All
export function getAllTadaConfig(body) {
  return axios.post(`${BASE_URL}/tada_config/read-all-tada-config`, body);
}

// Read One
export function getTadaConfigById(id) {
  return axios.post(`${BASE_URL}/tada_config/read-tada-config`, { id });
}

// Update
export function updateTadaConfig(body) {
  return axios.post(`${BASE_URL}/tada_config/update-tada-config`, body);
}

// Delete
export function deleteTadaConfig(id) {
  return axios.post(`${BASE_URL}/tada_config/delete-tada-config`, { id });
}
