import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Fetch all sent facilitator ownerships
export function getAllFacilitatorOwnershipSent(body) {
  return axios.post(`${API_URL}/facilitator_ownership/read-all-facilitator-ownership`, body);
}

// Fetch all received facilitator ownerships
export function getAllFacilitatorOwnershipReceived(body) {
  return axios.post(`${API_URL}/facilitator_ownership/read-all-facilitator-ownership-received`, body);

}

export function transferFacilitatorTickets(body) {
  return axios.post(`${API_URL}/facilitator_ownership/transfer-facilitator-ownership`, body)
}

