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

  return axios.patch(`${USERS_URL}/applicant_profile/delete-applicant-profile`, body);
}

//Post
// export function postApplicantProfile(body) {

//   return axios.patch(`${USERS_URL}/applicant_profile/post-applicant-profile`, body);
// }


//Hold
// export function holdApplicantProfile(body) {

//   return axios.patch(`${USERS_URL}/applicant_profile/hold-applicant-profile`, body);
// }


//Close
// export function closeApplicantProfile(body) {

//   return axios.patch(`${USERS_URL}/applicant_profile/close-applicant-profile`, body);
// }


export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}
