import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createUser(body) {
  // console.log("CreateUser", body)
  return axios.post(`${USERS_URL}/users/create-user`, body);
}

// Read
export function getAllUsers(body) {
  return axios.post(`${USERS_URL}/users/read-all-users`, body);
}

export function getUserById(id) {
  // console.log("getUserById id", id)
  return axios.post(`${USERS_URL}/users/read-user`, id);
}

//Update
export function updateUser(user) {
  // console.log("updateUser", user)
  return axios.put(`${USERS_URL}/users/update-user`, user);
}

//Delete
export function deleteUser(body) {
  return axios.patch(`${USERS_URL}/users/delete-user`, body);
}

//get All Roles
export function getAllRoles() {
  return axios.get(`${USERS_URL}/settings/read-all-roles-master-data`);
}

//get All Centers



export function getAllUserStatusTypes(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}
