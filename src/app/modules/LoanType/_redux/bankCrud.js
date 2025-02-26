import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createLoanType(body) {

  return axios.post(`${USERS_URL}/loan_type/create-loan-type`, body);
}


// Read
// export function getAll_LoanType(body) {

//   return axios.post(`${USERS_URL}/loan_type/read-all-loan-type`, body);
// }

export function getAll_LoanType(body) {
  const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/loan_type/read-all-loan-type`, body, config);
}



export function get_LoanTypeById(id) {

  return axios.post(`${USERS_URL}/loan_type/read-loan-type`, id);
}

//Update
export function update_LoanType(loan_type) {
   
  return axios.put(`${USERS_URL}/loan_type/update-loan-type`, loan_type);
}

//Delete
export function delete_LoanType(body) {

  return axios.patch(`${USERS_URL}/loan_type/delete-loan-type`, body);
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


