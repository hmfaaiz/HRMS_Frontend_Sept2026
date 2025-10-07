import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createJobVacancy(body) {

  return axios.post(`${USERS_URL}/hr_requisition_job_vacancy/create-hr-requisition-job-vacancy`, body);
  
}


// Read
export function getAllJobVacancy(body) {

  return axios.post(`${USERS_URL}/hr_requisition_job_vacancy/read-all-hr-requisition-job-vacancy`, body);
}

export function getJobVacancyById(id) {

  return axios.get(`${USERS_URL}/hr_requisition_job_vacancy/read-hr-requisition-job-vacancy/${id}`);
}

//Update
export function updateJobVacancy(body) {
   
  return axios.put(`${USERS_URL}/hr_requisition_job_vacancy/update-hr-requisition-job-vacancy`, body);
}

//Delete
export function deleteJobVacancy(id) {

  return axios.delete(`${USERS_URL}/hr_requisition_job_vacancy/delete-hr-requisition-job-vacancy/${id}`);
}

//Post





