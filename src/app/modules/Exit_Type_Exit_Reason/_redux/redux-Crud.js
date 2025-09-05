import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/exit_type_exit_reason/create-exit-type-exit-reason`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/exit_type_exit_reason/read-all-exit-type-exit-reason`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.get(`${USERS_URL}/exit_type_exit_reason/read-exit-type-exit-reason/${id}`);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/exit_type_exit_reason/update-exit-type-exit-reason`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(body) {

  return axios.patch(`${USERS_URL}/exit_type_exit_reason/delete-exit-type-exit-reason`, body);
}
