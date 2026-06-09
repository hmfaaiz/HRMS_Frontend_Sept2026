import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create budget
export function createbudgetYearSetup(body) {


  return axios.post(`${USERS_URL}/budget_setup_year/create-budget-setup`, body);

}


// Read
export function getAllbudgetYearSetup(body) {

  return axios.post(`${USERS_URL}/budget_setup_year/read-all-budget-setup`, body);
}

export function getbudgetYearSetupById(id) {

  return axios.post(`${USERS_URL}/budget_setup_year/read-budget-setup`, id);
}

//Update
export function updatebudgetYearSetup(body) {

  return axios.put(`${USERS_URL}/budget_setup_year/update-budget-setup`, body);
}

//Delete
export function deletebudgetYearSetup(body) {


  return axios.patch(`${USERS_URL}/budget_setup_year/delete-budget-setup`, body);
}

