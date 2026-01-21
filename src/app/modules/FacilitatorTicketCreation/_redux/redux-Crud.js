import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create
export function createTicketCreation(body) {

  return axios.post(`${USERS_URL}/facilitator_ticket_creation/create-facilitator-ticket-creation`, body);

}


// Read
export function getAllTicketCreation(body) {

  return axios.post(`${USERS_URL}/facilitator_ticket_creation/read-all-facilitator-ticket-creation`, body);
}
//Receive
export function getAllReceiveTicket(body) {
  return axios.post(`${USERS_URL}/facilitator_ticket_creation/read-all-receive-facilitator-ticket-creation`, body);
}

export function getTicketCreationById(id) {

  return axios.get(`${USERS_URL}/facilitator_ticket_creation/read-facilitator-ticket-creation/${id}`);
}

//Update
export function updateTicketCreation(body) {

  return axios.put(`${USERS_URL}/facilitator_ticket_creation/update-facilitator-ticket-creation`, body);
}

//Delete
export function deleteTicketCreation(Id) {

  return axios.delete(`${USERS_URL}/facilitator_ticket_creation/delete-facilitator-ticket-creation/${Id}`);
}
export function deleteTimeLog(Id) {

  return axios.delete(`${USERS_URL}/facilitator_ticket_creation/delete-ticket-creation-time-log/${Id}`);
}

export function getAllFacilitatorDetail(Id) {

  return axios.get(`${USERS_URL}/facilitator_ticket_creation/read-all-facilitator-detail/${Id}`);
}
export function getAllFacilitatorTimeLogDetail(Id) {

  return axios.get(`${USERS_URL}/facilitator_ticket_creation/read-all-facilitator-timelog-detail/${Id}`);
}

export function createTimeLog(body) {

  return axios.post(`${USERS_URL}/facilitator_ticket_creation/create-ticket-creation-time-log`, body);

}

export function getTimeLog(Id) {

  return axios.get(`${USERS_URL}/facilitator_ticket_creation/read-ticket-creation-time-log/${Id}`);
}