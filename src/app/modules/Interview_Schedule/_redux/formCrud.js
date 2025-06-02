import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getJobVancy(body) {
  return axios.post(`${USERS_URL}/interview_schedule/read-job-vacancy`, body);
}

export function getInterviewApplicants(body) {
  return axios.post(
    `${USERS_URL}/interview_schedule/read-all-interview-applicants`,
    body
  );
}

export function getApplicantProfile(body) {
  return axios.post(
    `${USERS_URL}/interview_schedule/read-applicant-profile`,
    body
  );
}

export async function getProfileInfo(body) {
  return axios.post(`${USERS_URL}/emp_portal/read-profile-by-empId`, body);
}

export function createInterview(body) {
  return axios.post(
    `${USERS_URL}/interview_schedule/create-interview-schedule`,
    body
  );
}

export function getInterviewList(body) {
  return axios.post(`${USERS_URL}/interview_schedule/get-interview-list`, body);
}

export function getInterviewById(body) {
  return axios.post(`${USERS_URL}/interview_schedule/interview-by-id`, body);
}

export function updateInterview(body) {
  return axios.post(
    `${USERS_URL}/interview_schedule/update-interview-schedule`,
    body
  );
}

export function deleteInterview(body) {
  return axios.post(
    `${USERS_URL}/interview_schedule/delete-interview-schedule`,
    body
  );
}
