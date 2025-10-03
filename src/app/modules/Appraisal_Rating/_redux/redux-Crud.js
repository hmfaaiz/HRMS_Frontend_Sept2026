import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAppraisalRating(body) {
  return axios.post(
    `${USERS_URL}/appraisal_rating/create-appraisal-rating`,
    body
  );
}

// Read
export function getAllAppraisalRating(body) {
  return axios.post(
    `${USERS_URL}/appraisal_rating/read-all-appraisal-rating`,
    body
  );
}

export function getAppraisalRatingById(id) {
  return axios.post(
    `${USERS_URL}/appraisal_rating/read-appraisal-rating`,
    id
  );
}

//Update
export function updateAppraisalRating(body) {
  return axios.put(
    `${USERS_URL}/appraisal_rating/update-appraisal-rating`,
    body
  );
}

//Delete
export function deleteAppraisalRating(body) {
  return axios.patch(
    `${USERS_URL}/appraisal_rating/delete-appraisal-rating`,
    body
  );
}
