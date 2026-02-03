import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Get Project Timeline Tickets
export function getProjectTimeline(body) {
  return axios.post(`${API_URL}/project_timeline/read-all-project-timeline`, body);
}

// Update ticket statuses (bulk) 
export function updateTicketStatuses(body) {
  return axios.put(`${API_URL}/project_timeline/update-project-timeline`, body);
}