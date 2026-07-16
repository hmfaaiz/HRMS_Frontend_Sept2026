import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetInspectionList(body) {

  return axios.post(`${USERS_URL}/asset_checklist/create-asset-checklist`, body);
  
}


// Read
export function getAllAssetInspectionList(body) {

  return axios.post(`${USERS_URL}/asset_checklist/read-all-asset-checklist`, body);
}

export function getAssetInspectionListById(body) {

  return axios.post(`${USERS_URL}/asset_checklist/read-asset-checklist`,body);
}

//Update
export function updateAssetInspectionList(assetInspectionList) {
   
  return axios.put(`${USERS_URL}/asset_checklist/update-asset-checklist`, assetInspectionList);
}

//Delete
export function deleteAssetInspectionList(body) {

  return axios.patch(`${USERS_URL}/asset_checklist/delete-asset-checklist`, body);
}
