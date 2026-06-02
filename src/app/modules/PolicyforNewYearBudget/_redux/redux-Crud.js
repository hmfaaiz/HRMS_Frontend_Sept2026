import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createPolicyforNewYearBudget(body) {

  return axios.post(`${USERS_URL}/policy_for_new_year_budget/create-policy-for-new-year-budget`, body);
  
}


// Read
export function getAllPolicyforNewYearBudget(body) {

  return axios.post(`${USERS_URL}/policy_for_new_year_budget/read-all-policy-for-new-year-budget`, body);
}

export function getPolicyforNewYearBudgetById(id) {

  return axios.post(`${USERS_URL}/policy_for_new_year_budget/read-policy-for-new-year-budget`, id);
}

//Update
export function updatePolicyforNewYearBudget(body) {
   
  return axios.put(`${USERS_URL}/policy_for_new_year_budget/update-policy-for-new-year-budget`, body);
}

//Delete
export function deletePolicyforNewYearBudget(body) {

  return axios.patch(`${USERS_URL}/policy_for_new_year_budget/delete-policy-for-new-year-budget`, body);
}

