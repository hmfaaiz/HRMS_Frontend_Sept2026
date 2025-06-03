import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getJobVancy(body) {
  return axios.post(`${USERS_URL}/settings/read-job-vacancy-detail`, body);
}

export function getInterviewApplicants(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-job-applicants`,
    body
  );
}

export function getApplicantProfile(body) {
  return axios.post(
    `${USERS_URL}/settings/read-job-applicant-detail`,
    body
  );
}

export function generatejob_offer_letter(body) {

  const config = {
    responseType:  'arraybuffer', 
  };

  return axios.post(`${USERS_URL}/job_offer/generate-offer-letter`, body,config);
}

