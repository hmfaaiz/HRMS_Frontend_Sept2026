import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Ticket Status
export function createTicketStatus(body) {
  return axios.post(`${API_URL}/ticket_status/create-ticket-status`, body);
}

// Get All Ticket Statuses (pagination & search)
export function getAllTicketStatuses(body) {
  return axios.post(`${API_URL}/ticket_status/read-all-ticket-status`, body);
}

// Get Ticket Status by ID
export function getTicketStatusById(body) {
  return axios.post(`${API_URL}/ticket_status/read-ticket-status`, body);
}

// Update Ticket Status
export function updateTicketStatus(body) {
  return axios.put(`${API_URL}/ticket_status/update-ticket-status`, body);
}

// Delete Ticket Status
export function deleteTicketStatus(body) {
  return axios.patch(`${API_URL}/ticket_status/delete-ticket-status`, body);
}
