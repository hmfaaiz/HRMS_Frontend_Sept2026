import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


// Read
export function getAllRoster(body) {

  return axios.post(`${USERS_URL}/roster_calendar/read-roster-calendar`, body);
}


