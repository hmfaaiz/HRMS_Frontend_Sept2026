import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployee_Salary(body) {
  console.log("create earning step 1", body)
  
  // body.Name = body.txtEarningName;
  // delete body.txtEarningName

  return axios.post(`${USERS_URL}/employee_salary_earning/create-employee-salary-earning`, body);
}


// Read
export function getAllEmployee_Salary(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/employee_salary_earning/read-all-employee-salary-earning`, body);
}



export function getEmployee_SalaryById(id) {
   console.log(" earning id", id)
  return axios.post(`${USERS_URL}/employee_salary_earning/read-employee-salary-earning`, id);
}

//Update
export function updateEmployee_Salary(earning) {
   console.log("earning 12", earning)
  return axios.put(`${USERS_URL}/employee_salary_earning/update-employee-salary-earning`, earning);
}

//Delete
export function deleteEmployee_Salary(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/employee_salary_earning/delete-employee-salary-earning`, body);
}


