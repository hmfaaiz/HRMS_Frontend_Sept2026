import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createBranch(body) {

  
  return axios.post(`${USERS_URL}/branch/create-branch`, body);
  
}


// Read
// export function getAllBranch(body) {

//   return axios.post(`${USERS_URL}/branch/read-all-branch`, body);
// }
 

export function getAllBranch(body) {
  const config = {
    responseType: (body.pdf || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/branch/read-all-branch`, body, config);
}


export function getBranchById(id) {
 
  return axios.post(`${USERS_URL}/branch/read-branch`, id);
}

//Update
export function updateBranch(bank) {

  return axios.put(`${USERS_URL}/branch/update-branch`, bank);
}

//Delete
export function deleteBranch(body) {


  return axios.patch(`${USERS_URL}/branch/delete-branch`, body);
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



export function sms_athentication(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}
