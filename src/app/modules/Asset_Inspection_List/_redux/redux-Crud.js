import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetInspectionList(body) {

  return axios.post(`${USERS_URL}/asset_inspection_list/create-asset-inspection-list`, body);
  
}


// Read
export function getAllAssetInspectionList(body) {

  return axios.post(`${USERS_URL}/asset_inspection_list/read-all-asset-inspection-list`, body);
}

export function getAssetInspectionListById(id) {

  return axios.get(`${USERS_URL}/asset_inspection_list/read-asset-inspection-list/${id}`);
}

//Update
export function updateAssetInspectionList(assetInspectionList) {
   
  return axios.put(`${USERS_URL}/asset_inspection_list/update-asset-inspection-list`, assetInspectionList);
}

//Delete
export function deleteAssetInspectionList(body) {

  return axios.patch(`${USERS_URL}/asset_inspection_list/delete-asset-inspection-list`, body);
}
