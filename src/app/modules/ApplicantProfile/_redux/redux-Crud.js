import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createApplicantProfile(body) {

  return axios.post(`${USERS_URL}/applicant_profile/create-applicant-profile`, body);
  
}


// Read
export function getAllApplicantProfile(body) {

  return axios.post(`${USERS_URL}/applicant_profile/read-all-applicant-profile`, body);
}

export function getApplicantProfileById(id) {

  return axios.post(`${USERS_URL}/applicant_profile/read-applicant-profile`, id);
}

//Update
export function updateApplicantProfile(body) {
   
  return axios.put(`${USERS_URL}/applicant_profile/update-applicant-profile`, body);
}

//Delete
export function deleteApplicantProfile(body) {

  return axios.delete(`${USERS_URL}/applicant_profile/delete-applicant-profile`, body);
}

//delete Applicant cancancy
export function deleteApplicantVacancyDetailById(body) {
  return axios.delete(`${USERS_URL}/applicant_profile/delete-profile-applicant-vacancy/${body}`);
}

export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}


export function convertApplicantToEmployee(body) {
   
  return axios.put(`${USERS_URL}/applicant_profile/convert-applicant-employee`, body);
}