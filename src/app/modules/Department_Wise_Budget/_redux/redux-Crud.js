import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createPolicyforNewYearBudget(body) {

  return axios.post(`${USERS_URL}/department_wise_budget/create-department-wise-budget`, body);
  
}


// Read
export function getAllPolicyforNewYearBudget(body) {

  return axios.post(`${USERS_URL}/department_wise_budget/read-all-department-wise-budget`, body);
}

export function getPolicyforNewYearBudgetById(body) {

  return axios.post(`${USERS_URL}/department_wise_budget/read-department-wise-budget`, body);
}

//Update
export function updatePolicyforNewYearBudget(body) {
   
  return axios.put(`${USERS_URL}/department_wise_budget/update-department-wise-budget`, body);
}

//Delete
export function deleteDepartmentWiseBudget(body) {

  return axios.patch(`${USERS_URL}/department_wise_budget/delete-department-wise-budget`, body);
}

