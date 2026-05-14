import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;



export async function getAllApplication(body) {
  return axios.post(
    `${USERS_URL}/job_requestion_workflow_approval/read-all-job-requestion-workflow-approval`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/job_requestion_workflow_approval/read-job-requestion-workflow-approval/${id}`);
}

export function handleAttendanceRequest(body) {
  return axios.post(
    `${USERS_URL}/job_requestion_workflow_approval/handle-job-requestion-approval`,
    body
  );
}
