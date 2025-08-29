import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmpProfile(body) {

  
  // body.Name = body.txtbankName;
  // delete body.txtbankName

  return axios.post(`${USERS_URL}/profile/create-profile`, body);
  
}
// Read
export function getAllEmpProfile(body) {

  return axios.post(`${USERS_URL}/profile/read-all-profile`, body);
}

export function getAllContactInfo(body) {

  return axios.post(`${USERS_URL}/profile/read-all-contact`, body);
}


export function getEmpProfileById(id) {
 
  return axios.post(`${USERS_URL}/profile/read-profile`, id);
}

//Update
export function updateEmpProfile(bodyObj) {

  return axios.put(`${USERS_URL}/profile/update-profile`, bodyObj);
}

//Delete
export function deleteEmpProfile(body) {


  return axios.patch(`${USERS_URL}/profile/delete-profile`, body);
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



