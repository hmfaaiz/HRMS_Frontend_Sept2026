import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export function uploadImage(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

//Create record
export function createEmployeeLoanRequest(body) {
 

  return axios.post(`${USERS_URL}/employee_loan_request/create-employee-loan-request`, body);

  
}


// Read
export function getAllEmployeeLoanRequest(body) {


  return axios.post(`${USERS_URL}/employee_loan_request/read-all-employee-loan-request`, body);
}

export function getEmployeeLoanRequestById(id) {

  return axios.post(`${USERS_URL}/employee_loan_request/read-employee-loan-request`, id);
}

//Update
export function updateEmployeeLoanRequest(employeeLoanRequest) {
   
  return axios.put(`${USERS_URL}/employee_loan_request/update-employee-loan-request`, employeeLoanRequest);
}

//Delete
export function deleteEmployeeLoanRequest(body) {

  return axios.patch(`${USERS_URL}/employee_loan_request/delete-employee-loan-request`, body);
}

export function getAllLoanConfigDetail(body) {
 

  return axios.post(`${USERS_URL}/employee_loan_request/read-loan-configuration-details`, body);

  
}

export function getAllLoanType() {


  return axios.get(`${USERS_URL}/loan_management_configuration/get-all-loan-type`);

  
}

export function updateApprovedStatus(data) {
   
  return axios.put(`${USERS_URL}/employee_loan_request/update-loan-approved-status`, data);
}