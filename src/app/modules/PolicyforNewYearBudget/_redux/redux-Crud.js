import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createHoliday(body) {

  return axios.post(`${USERS_URL}/policy_for_new_year_budget/create-policy-for-new-year-budget`, body);
  
}


// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/policy_for_new_year_budget/read-all-policy-for-new-year-budget`, body);
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

export function sendHolidayEmail(body) {

  return axios.put(`${USERS_URL}/holidays/send-holiday-email`, body);
}
