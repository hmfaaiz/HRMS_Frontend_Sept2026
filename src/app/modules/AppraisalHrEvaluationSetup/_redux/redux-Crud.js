import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createHrEvaluationSetup(body) {

  return axios.post(`${USERS_URL}/hr_evaluation_setup/create-hr-evaluation-setup`, body);
  
}


// Read
export function getAllHrEvaluationSetup(body) {

  return axios.post(`${USERS_URL}/hr_evaluation_setup/read-all-hr-evaluation-setup`, body);
}

export function getHrEvaluationSetupById(Id) {

  return axios.get(`${USERS_URL}/hr_evaluation_setup/read-hr-evaluation-setup/${Id}`);
}

//Update
export function updateHrEvaluationSetup(body) {
   
  return axios.put(`${USERS_URL}/hr_evaluation_setup/update-hr-evaluation-setup`, body);
}

//Delete
export function deleteHrEvaluationSetup(Id) {

  return axios.delete(`${USERS_URL}/hr_evaluation_setup/delete-hr-evaluation-setup/${Id}`);
}
