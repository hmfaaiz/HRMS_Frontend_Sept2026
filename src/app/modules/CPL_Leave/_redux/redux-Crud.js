import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAssetRegister(body) {

  return axios.post(`${USERS_URL}/cpl_leave/create-cpl-leave`, body);
  
}


// Read
export function getAllAssetRegister(body) {

  return axios.post(`${USERS_URL}/cpl_leave/read-all-cpl-leave`, body);
}

export function getAssetRegisterById(id) {

  return axios.get(`${USERS_URL}/cpl_leave/read-cpl-leave/${id}`);
}

//Update
export function updateAssetRegister(body) {
   
  return axios.put(`${USERS_URL}/cpl_leave/update-cpl-leave`, body);
}

//Delete
export function deleteAssetRegister(Id) {

  return axios.delete(`${USERS_URL}/cpl_leave/delete-cpl-leave/${Id}`);
}
