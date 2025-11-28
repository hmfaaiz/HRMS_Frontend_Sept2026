import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createHoliday(body) {

  return axios.post(`${USERS_URL}/company_doc/create-company-doc`, body);
  
}


// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/company_doc_portal/read-all-company-doc-portal`, body);
}

export function getHolidayById(id) {

  return axios.get(`${USERS_URL}/company_doc/read-company-doc/${id}`);
}

//Update
export function updateHoliday(body) {
   
  return axios.put(`${USERS_URL}/company_doc/update-company-doc`, body);
}

//Delete
export function deleteHoliday(Id) {

  return axios.delete(`${USERS_URL}/company_doc/delete-company-doc/${Id}`);
}
