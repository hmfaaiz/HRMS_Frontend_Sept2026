import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployee_Salary(body) {
  return axios.post(`${USERS_URL}/employee_salary/create-employee-salary`, body);
}

//Approve salary
export function approveEmployeeSalary(body) {
  return axios.put(`${USERS_URL}/employee_salary/approve-employee-salary`, body);
}


// Read
export function getAllEmployee_Salary(body) {
 
  return axios.post(`${USERS_URL}/employee_salary/read-all-employee-salary`, body);
}



export function getEmployee_SalaryById(id) {
  
  return axios.post(`${USERS_URL}/employee_salary/read-employee-salary`, id);
}

//Update
export function updateEmployee_Salary(earning) {
 
  return axios.put(`${USERS_URL}/employee_salary/update-employee-salary`, earning);
}

//Delete
export function deleteEmployee_Salary(body) {

  return axios.patch(`${USERS_URL}/employee_salary/delete-employee-salary`, body);
}


