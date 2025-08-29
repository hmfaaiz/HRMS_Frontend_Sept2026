import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createReimbursementConfig(body) {


  return axios.post(`${USERS_URL}/reimbursement_configuration/create-reimbursement-configuration`, body);

  
}


// Read
export function getAllReimbursementConfig(body) {

  return axios.post(`${USERS_URL}/reimbursement_configuration/read-all-reimbursement-configuration`, body);
}

export function getReimbursementConfigById(id) {

  return axios.post(`${USERS_URL}/reimbursement_configuration/read-reimbursement-configuration`, id);
}

//Update
export function updateReimbursementConfig(body) {
   
  return axios.put(`${USERS_URL}/reimbursement_configuration/update-reimbursement-configuration`, body);
}

//Delete
export function deleteReimbursementConfig(body) {

  return axios.patch(`${USERS_URL}/reimbursement_configuration/delete-reimbursement-configuration`, body);
}


export function deleteReimbursementConfigPolicy(body) {

  return axios.patch(`${USERS_URL}/reimbursement_configuration/delete-reimbursement-configuration-policy`, body);
}