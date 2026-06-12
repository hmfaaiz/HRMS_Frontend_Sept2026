import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Ticket
export function getDashboardData(body) {
  return axios.post(
    `${API_URL}/manpower_budget_dashboard/read-manpower-budget-dashboard`,
    body,
  );
}
