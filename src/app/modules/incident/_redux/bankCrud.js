import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createincident(body) {
  console.log("create incident step 1", body)
  
  // body.Name = body.txtincidentName;
  // delete body.txtincidentName

  return axios.post(`${USERS_URL}/incident/create-incident`, body);
}


// Read
export function getAllincident(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/incident/read-all-incident`, body);
}



export function getincidentById(id) {
   console.log(" incident id", id)
  return axios.post(`${USERS_URL}/incident/read-incident`, id);
}

//Update
export function updateincident(incident) {
   console.log("incident 12", incident)
  return axios.put(`${USERS_URL}/incident/update-incident`, incident);
}

//Delete
export function deleteincident(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/incident/delete-incident`, body);
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


