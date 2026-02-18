import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create TimeLog
export function createTimeLog(body) {
  return axios.post(`${API_URL}/time_logging_portal/create-time-log`, body);
}

// Get All TimeLogs
export function getAllTimeLogs(body) {
  return axios.post(`${API_URL}/time_logging_portal/read-all-time-log`, body);
}

// Get TimeLog by ID
export function getTimeLogById(body) {
  return axios.post(`${API_URL}/time_logging_portal/read-time-log`, body);
}

// Update TimeLog
export function updateTimeLog(body) {
  return axios.put(`${API_URL}/time_logging_portal/update-time-log`, body);
}

// Delete TimeLog
export function deleteTimeLog(body) {
  return axios.patch(`${API_URL}/time_logging_portal/delete-time-log`, body);
}

