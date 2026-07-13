import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/asset_model/create-asset-model`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/asset_model/read-all-asset-model`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.get(`${USERS_URL}/asset_model/read-asset-model/${id}`);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/asset_model/update-asset-model`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(body) {

  return axios.patch(`${USERS_URL}/asset_model/delete-asset-model`, body);
}
