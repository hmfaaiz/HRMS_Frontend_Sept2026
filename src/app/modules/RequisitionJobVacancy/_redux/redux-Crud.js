import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createJobVacancy(body) {

  return axios.post(`${USERS_URL}/requisition_job_vacancy/create-requisition-job-vacancy`, body);
  
}


// Read
export function getAllJobVacancy(body) {

  return axios.post(`${USERS_URL}/requisition_job_vacancy/read-all-requisition-job-vacancy`, body);
}

export function getJobVacancyById(id) {

  return axios.post(`${USERS_URL}/requisition_job_vacancy/read-requisition-job-vacancy`, id);
}

//Update
export function updateJobVacancy(body) {
   
  return axios.put(`${USERS_URL}/requisition_job_vacancy/update-requisition-job-vacancy`, body);
}

//Delete
export function deleteJobVacancy(body) {

  return axios.patch(`${USERS_URL}/requisition_job_vacancy/delete-requisition-job-vacancy`, body);
}

//Post
export function postJobVacancy(body) {

  return axios.patch(`${USERS_URL}/requisition_job_vacancy/post-requisition-job-vacancy`, body);
}


//Hold
export function holdJobVacancy(body) {

  return axios.patch(`${USERS_URL}/requisition_job_vacancy/hold-job-vacancy`, body);
}


//Close
export function closeJobVacancy(body) {

  return axios.patch(`${USERS_URL}/requisition_job_vacancy/close-job-vacancy`, body);
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
