import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createApplicantProfile(body) {

  return axios.post(`${USERS_URL}/separation/create-separation`, body);
  
}


// Read
export function getAllApplicantProfile(body) {

  return axios.post(`${USERS_URL}/separation/read-all-separation`, body);
}


// employee by status
export function getsEmpBySeparationFlag(body) {

  return axios.post(`${USERS_URL}/separation/read-emp-separation-byflag`, body);
}

export function getApplicantProfileById(id) {

  return axios.get(`${USERS_URL}/separation/read-separation/${id}`);
}

//Update
export function updateApplicantProfile(body) {
   
  return axios.put(`${USERS_URL}/applicant_profile/update-applicant-profile`, body);
}

//Delete
export function deleteApplicantProfile(id) {

  return axios.delete(`${USERS_URL}/separation/delete-separation/${id}`);
}


export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

