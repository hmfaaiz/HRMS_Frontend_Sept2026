import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAppraisal(body) {

  return axios.post(`${USERS_URL}/appraisal_period_setup/create-appraisal-period-setup`, body);
  
}


// Read
export function getAllAppraisal(body) {

  return axios.post(`${USERS_URL}/appraisal_period_setup/read-all-appraisal-period-setup`, body);
}

export function getAppraisalById(Id) {

  return axios.get(`${USERS_URL}/appraisal_period_setup/read-appraisal-period-setup/${Id}`);
}

//Update
export function updateAppraisal(body) {
   
  return axios.put(`${USERS_URL}/appraisal_period_setup/update-appraisal-period-setup`, body);
}

//Delete
export function deleteAppraisal(Id) {

  return axios.delete(`${USERS_URL}/appraisal_period_setup/delete-appraisal-period-setup/${Id}`);
}

//Delete
export function getAppraisalConfig(body) {
  return axios.post(`${USERS_URL}/appraisal_period_setup/read-appraisal-config` , body);
}
