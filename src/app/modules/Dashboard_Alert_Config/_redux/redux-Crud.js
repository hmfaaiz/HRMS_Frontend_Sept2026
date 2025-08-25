import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getDashboardAlertConfig() {
  return axios.get(`${USERS_URL}/dashboard/read-dashboard-alert`);
}

// Update
export function updateDashboardAlertConfig(body) {
  return axios.post(`${USERS_URL}/dashboard/update-dashboard-alert`, body);
}
