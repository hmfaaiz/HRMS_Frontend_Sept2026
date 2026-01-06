import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function getAppraisalEmployee(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/appraisal-employee`, body);
}

//Create user
export function getAllAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/emp_appraisal/read-all-appraisal-review`,
    body
  );
}

export function getAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/read-appraisal-review`, body);
}

export function createOrUpdateAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/create-appraisal-review`, body);
}

export function deleteAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/delete-appraisal-review`, body);
}
