import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/designation_wise_goal_setup/create-designation-wise-goal-setup`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/designation_wise_goal_setup/read-all-designation-wise-goal-setup`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.get(`${USERS_URL}/designation_wise_goal_setup/read-designation-wise-goal-setup/${id}`);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/designation_wise_goal_setup/update-designation-wise-goal-setup`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(Id) {

  return axios.delete(`${USERS_URL}/designation_wise_goal_setup/delete-designation-wise-goal-setup/${Id}`);
}
