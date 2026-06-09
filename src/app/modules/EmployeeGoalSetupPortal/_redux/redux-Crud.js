import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup_portal/create-employee-goal-setup`, body);

}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup_portal/read-all-employee-goal-setup`, body);
}

export function getAccrueGratuityConfigById(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup_portal/read-employee-goal-setup`, body);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {

  return axios.put(`${USERS_URL}/employee_goal_setup_portal/update-employee-goal-setup`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(body) {

  return axios.delete(`${USERS_URL}/employee_goal_setup_portal/delete-employee-goal-setup`, {
    data: body,
  });
}
//Designation wise goal setup
export function getDesignationWiseGoalSetupByEmp(body) {

  return axios.post(`${USERS_URL}/employee_goal_setup_portal/read-designation-wise-goal-setup-byemployeeId`, body);
}

export function getSubordinatesById() {
  return axios.get(`${USERS_URL}/employee_goal_setup_portal/fetch-subordinates-by-id`);
}
