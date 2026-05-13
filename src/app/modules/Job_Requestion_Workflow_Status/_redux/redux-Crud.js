import axios from "axios";
export const USERS_URL = process.env.REACT_APP_API_URL;

export async function getAllRecord(body) {
  return axios.post(
    `${USERS_URL}/job_requestion_workflow/read-all-job-requestion-workflow`,
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/job_requestion_workflow/read-job-requestion-workflow/${id}`,
  );
}
