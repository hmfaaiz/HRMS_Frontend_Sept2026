import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createGeneralEvaluationSetup(body) {

  return axios.post(`${USERS_URL}/general_evaluation_setup/create-general-evaluation-setup`, body);
  
}


// Read
export function getAllGeneralEvaluationSetup(body) {

  return axios.post(`${USERS_URL}/general_evaluation_setup/read-all-general-evaluation-setup`, body);
}

export function getGeneralEvaluationSetupById(Id) {

  return axios.get(`${USERS_URL}/general_evaluation_setup/read-general-evaluation-setup/${Id}`);
}

//Update
export function updateGeneralEvaluationSetup(body) {
   
  return axios.put(`${USERS_URL}/general_evaluation_setup/update-general-evaluation-setup`, body);
}

//Delete
export function deleteGeneralEvaluationSetup(Id) {

  return axios.delete(`${USERS_URL}/general_evaluation_setup/delete-general-evaluation-setup/${Id}`);
}
