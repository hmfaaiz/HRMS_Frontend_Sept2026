import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




//Create record
// export function createEmpSalaryRevision(body) {
 

//   return axios.post(`${USERS_URL}/emp_salary_revision/create-employee-salary-revision`, body);

  
// }


// Read setting
export function getAllEmpForSalaryRevision() {

  return axios.get(`${USERS_URL}/settings/read-all-employee-for-salary-revision`);
}

// load all data 
export function getCurrentEmpSalaryInfoByEmpId(employeeId) {

return axios.get(`${USERS_URL}/emp_salary_revision/read-current-employee-salary/${employeeId}`);
}
//new record
export function createEmpSalaryRev(body) {

return axios.post(`${USERS_URL}/emp_salary_revision/create-employee-salary-revision`,body);
}

// previous record grid data
export function getAllPrevSalaryRevByEmpId(body) {

return axios.post(`${USERS_URL}/emp_salary_revision/read-all-employee-salary-revision`,body);
}

// load edit data only Employee Information
export function getAllEmpSalaryRevInfoById(Id) {

return axios.get(`${USERS_URL}/emp_salary_revision/read-salary-revision-byId/${Id}`,);
}
// delete
export function deleteEmpSalaryRevInfoById(Id) {

return axios.get(`${USERS_URL}/emp_salary_revision/delete-salary-revision-byId/${Id}`,);
}

// for modal data 
export function fetchPreviousEmpSalaryComp(Id) {

return axios.get(`${USERS_URL}/emp_salary_revision/read-previous-salary-revision-byId/${Id}`,);
}

// for modal data 
export function fetchEmployeeSalaryEarningListFromProcedure(body) {

return axios.post(`${USERS_URL}/emp_salary_revision/read-salary-policy-byfilters`,body);
}
export function downloadSalaryRevisionPdfRequest(Id) {
  return axios.get(
    `${USERS_URL}/emp_salary_revision/salary-revision-report/${Id}`,
    { responseType: "arraybuffer" }
  );
}