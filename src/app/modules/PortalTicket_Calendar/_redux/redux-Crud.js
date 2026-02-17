import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


// Read
export function getAllTicketCalendar(body) {

  return axios.post(`${USERS_URL}/portal_ticket_calendar/read-ticket-calendar`, body);
}


