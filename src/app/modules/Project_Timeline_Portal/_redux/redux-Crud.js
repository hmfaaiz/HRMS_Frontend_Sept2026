import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Get Project Timeline Tickets
export function getProjectTimeline(body) {
  const config = {
    responseType: (body.pdf || body.excel || body.csv) ? "arraybuffer" : "json",
  };

  return axios.post(
    `${API_URL}/project_timeline_portal/read-all-project-timeline`,
    body,
    config
  );
}

// Update ticket statuses (bulk) 
export function updateTicketStatuses(body) {
  return axios.put(`${API_URL}/project_timeline_portal/update-project-timeline`, body);
}