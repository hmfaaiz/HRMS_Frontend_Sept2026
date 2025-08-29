import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployee_Salary_Expatriate(body) {
  console.log("create earning step 1", body)
  
  // body.Name = body.txtEarningName;
  // delete body.txtEarningName

  return axios.post(`${USERS_URL}/salary_expatriate/create-employee-salary-expatriate`, body);
}


// Read
export function getAllEmployee_Salary_Expatriate(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/salary_expatriate/read-all-employee-salary-expatriate`, body);
}



export function getEmployee_Salary_ExpatriateById(id) {
   console.log(" earning id", id)
  return axios.post(`${USERS_URL}/salary_expatriate/read-employee-salary-expatriate`, id);
}

//Update
export function updateEmployee_Salary_Expatriate(earning) {
   console.log("earning 12", earning)
  return axios.put(`${USERS_URL}/salary_expatriate/update-employee-salary-expatriate`, earning);
}

//Delete
export function deleteEmployee_Salary_Expatriate(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/salary_expatriate/delete-employee-salary-expatriate`, body);
}


