import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createDeduction(body) {

  
  // body.Name = body.txtDeductionName;
  // delete body.txtDeductionName

  return axios.post(`${USERS_URL}/deduction/create-deduction`, body);
}


// Read
// export function getAllDeduction(body) {

//   return axios.post(`${USERS_URL}/deduction/read-all-deduction`, body);
// }

export function getAllDeduction(body) {
  const config = {
    responseType: (body.pdf || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/deduction/read-all-deduction`, body, config);
}



export function getDeductionById(id) {

  return axios.post(`${USERS_URL}/deduction/read-deduction`, id);
}

//Update
export function updateDeduction(Deduction) {

  return axios.put(`${USERS_URL}/deduction/update-deduction`, Deduction);
}

//Delete
export function deleteDeduction(body) {

  return axios.patch(`${USERS_URL}/deduction/delete-deduction`, body);
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


