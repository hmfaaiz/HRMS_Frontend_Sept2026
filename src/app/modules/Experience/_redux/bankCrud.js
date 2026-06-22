import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExperience(body) {
  
  // body.Name = body.txtExperienceName;
  // delete body.txtExperienceName

  return axios.post(`${USERS_URL}/experience/create-experience`, body);
}


// Read
export function getAllExperiences(body) {
  return axios.post(`${USERS_URL}/experience/read-all-experience`, body);
}



export function getExperienceById(id) {
  return axios.post(`${USERS_URL}/experience/read-experience`, id);
}

//Update
export function updateExperience(experience) {
  return axios.put(`${USERS_URL}/experience/update-experience`, experience);
}

//Delete
export function deleteExperience(body) {
  return axios.patch(`${USERS_URL}/experience/delete-experience`, body);
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


