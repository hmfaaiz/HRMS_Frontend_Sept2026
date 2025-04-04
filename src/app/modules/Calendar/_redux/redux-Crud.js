import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createHoliday(body) {

  return axios.post(`${USERS_URL}/holidays/create-holidays`, body);
  
}


// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/holidays/read-all-holidays`, body);
}

export function getHolidayById(id) {

  return axios.post(`${USERS_URL}/holidays/read-holidays`, id);
}

//Update
export function updateHoliday(body) {
   
  return axios.put(`${USERS_URL}/holidays/update-holidays`, body);
}

//Delete
export function deleteHoliday(body) {

  return axios.patch(`${USERS_URL}/holidays/delete-holidays`, body);
}
