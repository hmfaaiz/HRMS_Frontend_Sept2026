import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllHoliday(body) {
  return axios.post(`${USERS_URL}/portal_calendar/read-holidays-me`, body);
}

export function getHolidayById(id) {
  return axios.post(`${USERS_URL}/holidays/read-holidays`, id);
}
