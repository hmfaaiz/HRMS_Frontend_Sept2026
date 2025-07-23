import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




//Create record
export function createEmpSalaryRevision(body) {
 

  return axios.post(`${USERS_URL}/emp_salary_revision/create-employee-salary-revision`, body);

  
}


// Read
export function getAllEmpSalaryRevision(body) {


  return axios.post(`${USERS_URL}/employee_loan_request/read-all-employee-loan-request`, body);
}

export function getEmpSalaryRevisionById(id) {

  return axios.post(`${USERS_URL}/employee_loan_request/read-employee-loan-request`, id);
}

//Update
export function updateEmpSalaryRevision(employeeLoanRequest) {
   
  return axios.put(`${USERS_URL}/employee_loan_request/update-employee-loan-request`, employeeLoanRequest);
}

//Delete
export function deleteEmpSalaryRevision(body) {

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