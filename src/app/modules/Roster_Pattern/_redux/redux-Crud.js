import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/roster_pattern/create-roster-pattern`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/roster_pattern/read-all-roster-pattern`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.post(`${USERS_URL}/roster_pattern/read-roster-pattern`, id);
}

//Update
export function updateAccrueGratuityConfig(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/roster_pattern/update-roster-pattern`, accrueGratuityConfig);
}

//Delete
export function deleteAccrueGratuityConfig(body) {

  return axios.patch(`${USERS_URL}/roster_pattern/delete-roster-pattern`, body);
}

export function getAutoCodeGenerate(body) {

  return axios.post(`${USERS_URL}/roster_pattern/autocode-generate`, body);
}