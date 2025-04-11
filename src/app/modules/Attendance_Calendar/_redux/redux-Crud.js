import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


// Read
export function getAllAttendance(body) {

  return axios.post(`${USERS_URL}/attendance_calendar/read-attendance-calendar`, body);
}


