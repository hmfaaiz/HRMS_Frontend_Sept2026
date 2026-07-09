import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_register/create-asset-register`, body);
  
}


// Read
export function getAllAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_register/read-all-asset-register`, body);
}

export function getAssetRegisterById(id) {

  return axios.get(`${USERS_URL}/asset_register/read-asset-register/${id}`);
}

//Update
export function updateAssetRegister(body) {
   
  return axios.put(`${USERS_URL}/asset_register/update-asset-register`, body);
}

//Delete
export function deleteAssetRegister(Id) {

  return axios.delete(`${USERS_URL}/asset_register/delete-asset-register/${Id}`);
}
export function assetAssignmentHistory(Id) {

  return axios.get(`${USERS_URL}/asset_register/read-asset-assignment-history/${Id}`);
}
