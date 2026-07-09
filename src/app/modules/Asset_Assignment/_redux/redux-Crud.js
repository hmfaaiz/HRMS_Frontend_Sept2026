import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_assignment/create-asset-assignment`, body);
  
}


// Read
export function getAllAssetRegister(body) {

  return axios.post(`${USERS_URL}/asset_assignment/read-all-asset-assignment`, body);
}

export function getAssetRegisterById(id) {

  return axios.get(`${USERS_URL}/asset_assignment/read-asset-assignment/${id}`);
}

//Update
export function updateAssetRegister(body) {
   
  return axios.put(`${USERS_URL}/asset_assignment/update-asset-assignment`, body);
}

//Delete
export function deleteAssetRegister(Id) {

  return axios.delete(`${USERS_URL}/asset_assignment/delete-asset-assignment/${Id}`);
}
export function assetAssignmentListByEmpId(Id) {

  return axios.get(`${USERS_URL}/asset_assignment/read-all-asset-assignment-list-by-empId/${Id}`);
}

export function unassignAssetRegister(Id) {

  return axios.put(`${USERS_URL}/asset_assignment/unassign-asset-assignment/${Id}`);
}