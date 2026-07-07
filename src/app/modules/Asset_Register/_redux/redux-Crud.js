import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createCompanyDoc(body) {

  return axios.post(`${USERS_URL}/asset_register/create-asset-register`, body);
  
}


// Read
export function getAllCompanyDoc(body) {

  return axios.post(`${USERS_URL}/asset_register/read-all-asset-register`, body);
}

export function getCompanyDocById(id) {

  return axios.get(`${USERS_URL}/asset_register/read-asset-register/${id}`);
}

//Update
export function updateCompanyDoc(body) {
   
  return axios.put(`${USERS_URL}/asset_register/update-asset-register`, body);
}

//Delete
export function deleteCompanyDoc(Id) {

  return axios.delete(`${USERS_URL}/asset_register/delete-asset-register/${Id}`);
}
