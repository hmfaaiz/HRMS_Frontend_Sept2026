import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup/create-employee-goal-setup`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup/read-all-employee-goal-setup`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.get(`${USERS_URL}/employee_goal_setup/read-employee-goal-setup/${id}`);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/employee_goal_setup/update-employee-goal-setup`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(Id) {

  return axios.delete(`${USERS_URL}/employee_goal_setup/delete-employee-goal-setup/${Id}`);
}
//Designation wise goal setup
export function getDesignationWiseGoalSetupByEmp(Id) {

  return axios.get(`${USERS_URL}/employee_goal_setup/read-designation-wise-goal-setup-byemployeeId/${Id}`);
}
