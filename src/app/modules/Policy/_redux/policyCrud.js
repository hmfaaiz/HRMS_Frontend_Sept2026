import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createpolicy(body) {

  
  // body.Name = body.txtbankName;
  // delete body.txtbankName

  return axios.post(`${USERS_URL}/policy/create-policy`, body);
  
}
// Read
// export function getAllpolicy(body) {

//   return axios.post(`${USERS_URL}/policy/read-all-policy`, body);
// }


export function getAllpolicy(body) {
  const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/policy/read-all-policy`, body, config);
}

export function getpolicyById(id) {
 
  return axios.post(`${USERS_URL}/policy/read-policy`, id);
}

//Update
export function updatepolicy(obj) {

  return axios.put(`${USERS_URL}/policy/update-policy`, obj);
}

//Delete
export function deletepolicy(body) {

 
  return axios.patch(`${USERS_URL}/policy/delete-policy`, body);
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



