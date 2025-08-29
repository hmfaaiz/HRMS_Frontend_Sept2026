import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAcademic(body) {
  console.log("create Academic step 1", body)
  
  // body.Name = body.txtAcademicName;
  // delete body.txtAcademicName

  return axios.post(`${USERS_URL}/academic/create-academic`, body);
}


// Read
export function getAllAcademics(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/academic/read-all-academic`, body);
}



export function getAcademicById(id) {
   console.log(" academic id", id)
  return axios.post(`${USERS_URL}/academic/read-academic`, id);
}

//Update
export function updateAcademic(academic) {
   console.log("academic 12", academic)
  return axios.put(`${USERS_URL}/academic/update-academic`, academic);
}

//Delete
export function deleteAcademic(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/academic/delete-academic`, body);
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


