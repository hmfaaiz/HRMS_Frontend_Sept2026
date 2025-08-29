import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createLoanManagConfig(body) {

  


  return axios.post(`${USERS_URL}/loan_management_configuration/create-loan-management-configuration`, body);

  
}


// Read
export function getAllLoanManagConfig(body) {

  return axios.post(`${USERS_URL}/loan_management_configuration/read-all-loan-management-configuration`, body);
}

export function getLoanManagConfigById(id) {

  return axios.post(`${USERS_URL}/loan_management_configuration/read-loan-management-configuration`, id);
}

//Update
export function updateLoanManagConfig(body) {
   
  return axios.put(`${USERS_URL}/loan_management_configuration/update-loan-management-configuration`, body);
}

//Delete
export function deleteLoanManagConfig(body) {

  return axios.patch(`${USERS_URL}/loan_management_configuration/delete-loan-management-configuration`, body);
}
export function getAllLoanType() {


  return axios.get(`${USERS_URL}/loan_management_configuration/get-all-loan-type`);

  
}

//Delete
export function deleteLoanManagConfigDetail(body) {

  return axios.patch(`${USERS_URL}/loan_management_configuration/delete-loan-management-configuration-detail`, body);
}