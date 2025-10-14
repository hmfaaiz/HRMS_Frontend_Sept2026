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

export function getAccrueGratuityConfigById(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup/read-employee-goal-setup`, body);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/employee_goal_setup/update-employee-goal-setup`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(body) {

  return axios.delete(`${USERS_URL}/employee_goal_setup/delete-employee-goal-setup`, {
     data: body,
  });
}
//Designation wise goal setup
export function getDesignationWiseGoalSetupByEmp(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup/read-designation-wise-goal-setup-byemployeeId`,body);
}
