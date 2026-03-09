import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Ticket
export function createTicket(body) {
  return axios.post(`${API_URL}/ticket_setup/create-ticket-setup`, body);
}

// Get All Tickets
export function getAllTickets(body) {
  const config = {
    responseType: body.pdf || body.excel || body.csv ? "arraybuffer" : "json",
  };

  return axios.post(
    `${API_URL}/ticket_setup/read-all-ticket-setup`,
    body,
    config,
  );
}

// Get Ticket by ID
export function getTicketById(body) {
  return axios.post(`${API_URL}/ticket_setup/read-ticket-setup`, body);
}

// Update Ticket
export function updateTicket(body) {
  return axios.put(`${API_URL}/ticket_setup/update-ticket-setup`, body);
}

// Delete Ticket
export function deleteTicket(body) {
  return axios.patch(`${API_URL}/ticket_setup/delete-ticket-setup`, body);
}

export function getLatestTicketNumBaseOnProjectId(body) {
  return axios.post(`${API_URL}/ticket_setup/get-ticket-number`, body);
}

export function getTimeLogDetail(body) {
  return axios.post(`${API_URL}/ticket_setup/get-ticket-time-log`, body);
}

export function uploadImage(body) {
  return axios.post(`${API_URL}/file-upload`, body);
}
