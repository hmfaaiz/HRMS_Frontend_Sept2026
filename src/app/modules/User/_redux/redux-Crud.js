import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createUser(body) {

  return axios.post(`${USERS_URL}/user/create-user`, body);
  
}


// Read
export function getAllUser(body) {

  return axios.post(`${USERS_URL}/user/read-all-user`, body);
}

export function getUserById(id) {

  return axios.post(`${USERS_URL}/user/read-user`, id);
}

//Update
export function updateUser(body) {
   
  return axios.put(`${USERS_URL}/user/update-user`, body);
}

//Delete
export function deleteUser(body) {

  return axios.patch(`${USERS_URL}/user/delete-user`, body);
}


//get All Roles
export function getAllRoles() {
  return axios.get(`${USERS_URL}/settings/read-all-roles-master-data`);
}
