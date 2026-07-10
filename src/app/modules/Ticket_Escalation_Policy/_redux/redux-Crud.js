import axios from "axios";

export const TICKET_ESCALATION_POLICY_URL = process.env.REACT_APP_API_URL;

// Create
export function createTicketEscalationPolicy(body) {
  return axios.post(`${TICKET_ESCALATION_POLICY_URL}/ticket_escalation_policy/create-ticket-escalation-policy`, body);
}

// Read All
export function getAllTicketEscalationPolicy(body) {
  return axios.post(`${TICKET_ESCALATION_POLICY_URL}/ticket_escalation_policy/read-all-ticket-escalation-policy`, body);
}

// Read By Id
export function getTicketEscalationPolicyById(id) {
  return axios.post(`${TICKET_ESCALATION_POLICY_URL}/ticket_escalation_policy/read-ticket-escalation-policy`, { Id: id });
}

// Update
export function updateTicketEscalationPolicy(body) {
  return axios.put(`${TICKET_ESCALATION_POLICY_URL}/ticket_escalation_policy/update-ticket-escalation-policy`, body);
}

// Delete
export function deleteTicketEscalationPolicy(body) {
  return axios.patch(`${TICKET_ESCALATION_POLICY_URL}/ticket_escalation_policy/delete-ticket-escalation-policy`, body);
}