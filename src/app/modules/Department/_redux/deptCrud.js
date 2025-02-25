import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createDept(body) {

  return axios.post(`${USERS_URL}/department/create-dept`, body);
}


// Read
// export function getAllDept(body) {

//   return axios.post(`${USERS_URL}/department/read-all-dept`, body);
// } 
 

export function getAllDept(body) {
  const config = {
    responseType: (body.pdf || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/department/read-all-dept`, body, config);
}

export function getDeptById(id) {

  return axios.post(`${USERS_URL}/department/read-dept`, id);
}

//Update
export function updateDept(bank) {

  return axios.put(`${USERS_URL}/department/update-dept`, bank);
}

//Delete
export function deleteDept(body) {


  return axios.patch(`${USERS_URL}/department/delete-dept`, body);
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
