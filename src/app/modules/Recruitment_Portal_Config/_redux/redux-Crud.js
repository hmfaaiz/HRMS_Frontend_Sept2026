import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getPortalConfig() {
  return axios.get(`${USERS_URL}/career/read-recruitment-config`);
}

// Update
export function updatePortalConfig(body) {
  return axios.post(`${USERS_URL}/career/update-recruitment-config`, body);
}
