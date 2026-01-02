import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployeeDoc(body) {

  return axios.post(`${USERS_URL}/facilitator_ticket_creation/create-facilitator-ticket-creation`, body);

}


// Read
export function getAllEmployeeDoc(body) {

  return axios.post(`${USERS_URL}/facilitator_ticket_creation/read-all-facilitator-ticket-creation`, body);
}
//Receive
export function getAllReceiveTicket(body) {
  return axios.post(`${USERS_URL}/facilitator_ticket_creation/read-all-receive-facilitator-ticket-creation`, body);
}

export function getEmployeeDocById(id) {

  return axios.get(`${USERS_URL}/facilitator_ticket_creation/read-facilitator-ticket-creation/${id}`);
}

//Update
export function updateEmployeeDoc(body) {

  return axios.put(`${USERS_URL}/facilitator_ticket_creation/update-facilitator-ticket-creation`, body);
}

//Delete
export function deleteEmployeeDoc(Id) {

  return axios.delete(`${USERS_URL}/facilitator_ticket_creation/delete-facilitator-ticket-creation/${Id}`);
}
