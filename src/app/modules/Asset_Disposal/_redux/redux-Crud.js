import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_disposal/create-asset-disposal`, body);
  
}


// Read
export function getAllAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_disposal/read-all-asset-disposal`, body);
}

export function getAssetRegisterById(id) {

  return axios.get(`${USERS_URL}/asset_disposal/read-asset-disposal/${id}`);
}

//Update
export function updateAssetRegister(body) {
   
  return axios.put(`${USERS_URL}/asset_disposal/update-asset-disposal`, body);
}

//Delete
export function deleteAssetRegister(Id) {

  return axios.delete(`${USERS_URL}/asset_disposal/delete-asset-disposal/${Id}`);
}
export function assetAssignmentListByEmpId(Id) {

  return axios.get(`${USERS_URL}/asset_disposal/read-all-asset-disposal-list-by-empId/${Id}`);
}

export function unassignAssetRegister(Id) {

  return axios.put(`${USERS_URL}/asset_disposal/unassign-asset-disposal/${Id}`);
}