import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllApproval(body) {
  return axios.post(
    `${USERS_URL}/job_requestion_approval/read-all-job-requestion-approval`,
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/job_requestion_approval/read-job-requestion-approval/${id}`,
  );
}

export function handleRequest(body) {
  return axios.post(
    `${USERS_URL}/job_requestion_approval/handle-job-requestion-approval`,
    body,
  );
}
