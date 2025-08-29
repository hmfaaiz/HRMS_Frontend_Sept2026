import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createGratuityConfig(body) {

  return axios.post(`${USERS_URL}/gratuity_configuration/create-gratuity-configuration`, body);
  
}


// Read
export function getAllGratuityConfig(body) {

  return axios.post(`${USERS_URL}/gratuity_configuration/read-all-gratuity-configuration`, body);
}

export function getGratuityConfigById(id) {

  return axios.post(`${USERS_URL}/gratuity_configuration/read-gratuity-configuration`, id);
}

//Update
export function updateGratuityConfig(body) {
   
  return axios.put(`${USERS_URL}/gratuity_configuration/update-gratuity-configuration`, body);
}

//Delete
export function deleteGratuityConfig(body) {

  return axios.patch(`${USERS_URL}/gratuity_configuration/delete-gratuity-configuration`, body);
}
