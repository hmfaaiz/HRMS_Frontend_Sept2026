import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createStoppageAllowance(body) {
  console.log("create StoppageAllowance step 1", body)
  
  // body.Name = body.txtStoppageAllowanceName;
  // delete body.txtStoppageAllowanceName

  return axios.post(`${USERS_URL}/stoppage/create-stoppage`, body);
}


// Read
export function getAllStoppageAllowance(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/stoppage/read-all-stoppage`, body);
}



export function getStoppageAllowanceById(id) {
   console.log(" StoppageAllowance id", id)
  return axios.post(`${USERS_URL}/stoppage/read-stoppage`, id);
}

//Update
export function updateStoppageAllowance(StoppageAllowance) {
   console.log("StoppageAllowance 12", StoppageAllowance)
  return axios.put(`${USERS_URL}/stoppage/update-stoppage`, StoppageAllowance);
}

//Delete
export function deleteStoppageAllowance(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/stoppage/delete-stoppage`, body);
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


