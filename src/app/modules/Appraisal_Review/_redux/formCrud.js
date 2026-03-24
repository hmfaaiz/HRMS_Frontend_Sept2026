import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function getAppraisalEmployee(body) {
  return axios.post(`${USERS_URL}/appraisal_review/appraisal-employee`, body);
}

//Create user
export function getAllAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/read-all-appraisal-review`,
    body,
  );
}

export function getAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/read-appraisal-review`,
    body,
  );
}

export function createOrUpdateAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/create-appraisal-review`,
    body,
  );
}

export function deleteAppraisalReview(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/delete-appraisal-review`,
    body,
  );
}

export function salaryRecomendationReport(body) {
  return axios.post(
    `${USERS_URL}/appraisal_review/salary-recommendation-report`,
    body,
    {
      responseType: "arraybuffer",
    },
  );
}


export function downloadAppraisalFinalizationPdfRequest(reviewId) {
  return axios.post(
    `${USERS_URL}/appraisal_review/appraisal-finalization-report`,
    { appraisalReviewPdf: reviewId },
    { responseType: "arraybuffer" },
  );
}