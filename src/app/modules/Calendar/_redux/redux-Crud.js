import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/calendar/read-holiday`, body);
}

export function getHolidayById(id) {

  return axios.post(`${USERS_URL}/holidays/read-holidays`, id);
}

