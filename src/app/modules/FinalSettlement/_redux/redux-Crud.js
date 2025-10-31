import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createSeparation(body) {

  return axios.post(`${USERS_URL}/final_settlement/create-final-settlement`, body);
  
}


// Read
export function getAllSeparation(body) {

  return axios.post(`${USERS_URL}/final_settlement/read-all-final-settlement`, body);
}


// employee by status
export function getsEmpBySeparationFlag(body) {

  return axios.post(`${USERS_URL}/final_settlement/read-final-settlement-byflag`, body);
}

export function getSeparationById(id) {

  return axios.get(`${USERS_URL}/final_settlement/read-final-settlement/${id}`);
}

//Update
export function updateSeparation(body) {
   
  return axios.put(`${USERS_URL}/final_settlement/update-final-settlement`, body);
}

//Delete
export function deleteSeparation(id) {

  return axios.delete(`${USERS_URL}/final_settlement/delete-final-settlement/${id}`);
}

// separated
export function separateById(body) {

  return axios.put(`${USERS_URL}/final_settlement/calculate-final-settlement/`,body);
}


export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

