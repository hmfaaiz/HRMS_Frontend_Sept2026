import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createJobVacancy(body) {

  return axios.post(`${USERS_URL}/job_vacancy/create-job-vacancy`, body);
  
}


// Read
export function getAllJobVacancy(body) {

  return axios.post(`${USERS_URL}/job_vacancy/read-all-job-vacancy`, body);
}

export function getJobVacancyById(id) {

  return axios.post(`${USERS_URL}/job_vacancy/read-job-vacancy`, id);
}

//Update
export function updateJobVacancy(body) {
   
  return axios.put(`${USERS_URL}/job_vacancy/update-job-vacancy`, body);
}

//Delete
export function deleteJobVacancy(body) {

  return axios.patch(`${USERS_URL}/job_vacancy/delete-job-vacancy`, body);
}
