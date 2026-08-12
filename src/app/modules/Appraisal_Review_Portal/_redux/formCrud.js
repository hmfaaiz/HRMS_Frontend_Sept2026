import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function getAppraisalEmployee(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/appraisal-employee`, body);
}

//Create user
export function getAllAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/emp_appraisal/read-all-emp-appraisal-review`,
    body
  );
}

export function getAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/read-emp-appraisal-review`, body);
}

export function createOrUpdateAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/create-emp-appraisal-review`, body);
}

export function deleteAppraisalReview(body) {
  return axios.post(`${USERS_URL}/emp_appraisal/delete-emp-appraisal-review`, body);
}

export function getAppraisalPublishRating(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/get-appraisal-publish-rating`,
    body,
  );
}