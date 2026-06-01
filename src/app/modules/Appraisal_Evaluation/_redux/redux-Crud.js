import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllAppraisalEvaluations(body) {
  return axios.post(
    `${USERS_URL}/appraisal_evaluation/read-all-appraisal-evaluation`,
    body
  );
}

export function getAppraisalEvaluationById(body) {
  return axios.post(
    `${USERS_URL}/appraisal_evaluation/read-appraisal-evaluation-question`,
    body
  );
}

export function updateAppraisalEvaluation(body) {
  return axios.post(
    `${USERS_URL}/appraisal_evaluation/update-appraisal-evaluation-question`,
    body
  );
}

export function getAppraisalEmployeeDetail(body) {
  return axios.post(
    `${USERS_URL}/appraisal_evaluation/read-appraisal-employee-detail`,
    body
  );
}

export function updateEvaluationConsent(body) {
  return axios.post(
    `${USERS_URL}/appraisal_evaluation/update-evaluation-consent`,
    body
  );
}