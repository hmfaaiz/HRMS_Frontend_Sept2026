import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/accrue_gratuity_configuration/create-accrue-gratuity-configuration`, body);
  
}


// Read
export function getAllAccrueGratuityConfig(body) {

  return axios.post(`${USERS_URL}/accrue_gratuity_configuration/read-all-accrue-gratuity-configuration`, body);
}

export function getAccrueGratuityConfigById(id) {

  return axios.post(`${USERS_URL}/accrue_gratuity_configuration/read-accrue-gratuity-configuration`, id);
}

//Update
export function updateAccrueGratuityConfig(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/accrue_gratuity_configuration/update-accrue-gratuity-configuration`, accrueGratuityConfig);
}

//Delete
export function deleteAccrueGratuityConfig(body) {

  return axios.patch(`${USERS_URL}/accrue_gratuity_configuration/delete-accrue-gratuity-configuration`, body);
}
