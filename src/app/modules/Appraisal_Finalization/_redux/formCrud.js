import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Read All
export function getAllAppraisalFinalization(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/read-all-appraisal-finalization`,
    body
  );
}

//Read All
export function getAppraisalFinalizationRatingById(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/read-appraisal-finalization-rating`,
    body
  );
}

export function getAppraisalFinalizationRatingOfFiscalPeriodById(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/read-appraisal-finalization-rating-fiscal-period`,
    body
  );
}

export function saveAppraisalFinalization(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/save-appraisal-finalization`,
    body
  );
}

export function finalizedAppraisal(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/finalized-appraisal`,
    body
  );
}

export function finalizedAppraisalEmail(body) {
  return axios.post(
    `${USERS_URL}/appraisal_finalization/finalized-appraisal-email`,
    body
  );
}

export function finalizedAppraisalLetterDownload(body) {
  const config = {
    responseType: "arraybuffer",
  };
  return axios.post(
    `${USERS_URL}/appraisal_finalization/download-appraisal-increment`,
    body,
    config
  );
}
