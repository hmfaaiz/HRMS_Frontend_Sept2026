import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getTaskDashboard(body) {
  return axios.post(`${USERS_URL}/task_dashboard/read-task-dashboard`, body);
}
