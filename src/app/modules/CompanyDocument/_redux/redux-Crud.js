import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createCompanyDoc(body) {

  return axios.post(`${USERS_URL}/company_doc/create-company-doc`, body);
  
}


// Read
export function getAllCompanyDoc(body) {

  return axios.post(`${USERS_URL}/company_doc/read-all-company-doc`, body);
}

export function getCompanyDocById(id) {

  return axios.get(`${USERS_URL}/company_doc/read-company-doc/${id}`);
}

//Update
export function updateCompanyDoc(body) {
   
  return axios.put(`${USERS_URL}/company_doc/update-company-doc`, body);
}

//Delete
export function deleteCompanyDoc(Id) {

  return axios.delete(`${USERS_URL}/company_doc/delete-company-doc/${Id}`);
}
