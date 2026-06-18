import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Ticket
export function getDashboardData(body) {
  return axios.post(
    `${API_URL}/manpower_budget_dashboard/read-manpower-budget-dashboard`,
    body,
  );
}

// Designation-Wise Budget Report, scoped server-side to the logged-in user
export function getDesignationWiseBudgetReport(body) {
  return axios.post(
    `${API_URL}/manpower_budget_dashboard/designation-wise-budget-report`,
    body,
    { responseType: "blob" },
  );
}