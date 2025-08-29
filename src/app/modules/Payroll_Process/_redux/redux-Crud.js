import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




//Create record
export function createPayrollProcess(body) {
 

  return axios.post(`${USERS_URL}/payroll_process/create-payroll-process`, body);

  
}


// Read
export function getAllPayrollProcess(body) {


  return axios.post(`${USERS_URL}/payroll_process/read-all-payroll-process`, body);
}

export function getPayrollProcessById(id) {

  return axios.post(`${USERS_URL}/payroll_process/read-payroll-process`, id);
}

//Update
export function updatePayrollProcess(body) {
   
  return axios.put(`${USERS_URL}/payroll_process/update-payroll-process`, body);
}

//Delete
export function deletePayrollProcess(body) {

  return axios.patch(`${USERS_URL}/payroll_process/delete-payroll-process`, body);

}

export function getAllPayrollGroupDetails(body) {


  return axios.post(`${USERS_URL}/payroll_process/read-all-payroll-group-detail`, body);
}


export function checkPayroll_EmployeesByIds(body) {

  return axios.post(`${USERS_URL}/payroll_process/check-payroll-employees`, body);
}


export function createPayroll_Stop_Salary(body) {

  return axios.post(`${USERS_URL}/payroll_process/create-payroll-stop-salary`, body);
}

export function createPayroll_Stop_Loan(body) {
 
  return axios.post(`${USERS_URL}/payroll_process/create-payroll-stop-loan`, body);
}