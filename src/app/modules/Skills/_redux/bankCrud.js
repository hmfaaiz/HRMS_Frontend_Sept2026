import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createSkills(body) {
  
  // body.Name = body.txtskillsName;
  // delete body.txtskillsName

  return axios.post(`${USERS_URL}/skills/create-skills`, body);
}


// Read
export function getAllSkills(body) {
  return axios.post(`${USERS_URL}/skills/read-all-skills`, body);
}



export function getSkillsById(id) {
  return axios.post(`${USERS_URL}/skills/read-skills`, id);
}

//Update
export function updateSkills(skills) {
  return axios.put(`${USERS_URL}/skills/update-skills`, skills);
}

//Delete
export function deleteSkills(body) {
  return axios.patch(`${USERS_URL}/skills/delete-skills`, body);
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


