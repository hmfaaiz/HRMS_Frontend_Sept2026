import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




//Create record
// export function createEmpSalaryRevision(body) {
 

//   return axios.post(`${USERS_URL}/emp_salary_revision/create-employee-salary-revision`, body);

  
// }


// Read
export function getAllEmpForSalaryRevision() {

  return axios.get(`${USERS_URL}/settings/read-all-employee-for-salary-revision`);
}

export function getCurrentEmpSalaryInfoByEmpId(employeeId) {

return axios.get(`${USERS_URL}/emp_salary_revision/read-current-employee-salary/${employeeId}`);
}

export function createEmpSalaryRev(body) {

return axios.post(`${USERS_URL}/emp_salary_revision/create-employee-salary-revision`,body);
}

export function getAllPrevSalaryRevByEmpId(body) {

return axios.post(`${USERS_URL}/emp_salary_revision/read-all-employee-salary`,body);
}

//Update
