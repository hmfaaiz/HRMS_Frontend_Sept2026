import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Ticket
export function createTicket(body) {
  return axios.post(`${API_URL}/ticket_setup_portal/create-ticket-setup`, body);
}

// Get All Tickets
export function getAllTickets(body) {
  const config = {
    responseType: (body.pdf || body.excel || body.csv) ? "arraybuffer" : "json",
  };

  return axios.post(
    `${API_URL}/ticket_setup_portal/read-all-ticket-setup`,
    body,
    config
  );
}

// Get Ticket by ID
export function getTicketById(body) {
  return axios.post(`${API_URL}/ticket_setup_portal/read-ticket-setup`, body);
}

// Update Ticket
export function updateTicket(body) {
  return axios.put(`${API_URL}/ticket_setup_portal/update-ticket-setup`, body);
}

// Delete Ticket
export function deleteTicket(body) {
  return axios.patch(`${API_URL}/ticket_setup_portal/delete-ticket-setup`, body);
}

export function getLatestTicketNumBaseOnProjectId(body) {
  return axios.post(`${API_URL}/ticket_setup_portal/get-ticket-number`, body);
}

export function getTimeLogDetail(body) {
  return axios.post(`${API_URL}/ticket_setup_portal/get-ticket-time-log`, body);
}

export function ticketTimeLog(body) {
  return axios.post(`${API_URL}/ticket_setup_portal/ticket-time-log`, body);
}


export function uploadImage(body) {
  return axios.post(`${API_URL}/file-upload`, body);
}