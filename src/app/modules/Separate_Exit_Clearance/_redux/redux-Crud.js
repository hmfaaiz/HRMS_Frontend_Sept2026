import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExitTypeExitReason(body) {

  return axios.post(`${USERS_URL}/exit_clearance/create-exit-clearance`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/exit_clearance/read-all-exit-clearance`, body);
}

export function getAccrueGratuityConfigById(Id) {

  return axios.get(`${USERS_URL}/exit_clearance/read-exit-clearance/${Id}`);
}

//Update
export function updateExitTypeExitReason(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/exit_clearance/update-exit-clearance`, accrueGratuityConfig);
}

//Delete
export function deleteExitTypeExitReason(Id) {

  return axios.delete(`${USERS_URL}/exit_clearance/delete-exit-clearance/${Id}`, {

  });
}
//Designation wise goal setup
export function getDesignationWiseGoalSetupByEmp(body) {

  return axios.post(`${USERS_URL}/exit_clearance/load-data`,body);
}
