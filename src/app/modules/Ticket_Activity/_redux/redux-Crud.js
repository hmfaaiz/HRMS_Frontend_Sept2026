import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create or Update Ticket Comments
export function createOrUpdateComment(body) {
  return axios.post(`${API_URL}/ticket_activity/update-ticket-comment`, body);
}

// Get All Tickets Comments
export function getAllTicketComments(body) {
  return axios.post(
    `${API_URL}/ticket_activity/read-all-ticket-comments`,
    body,
  );
}


// Get All Tickets Comments
export function getAllSubTickets(body) {
  return axios.post(
    `${API_URL}/ticket_activity/read-all-sub-ticket`,
    body,
  );
}

export function deleteComment(body) {
  return axios.post(`${API_URL}/ticket_activity/delete-ticket-comment`, body);
}