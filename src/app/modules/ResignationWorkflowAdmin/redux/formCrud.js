import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;



export async function getAllResignationApproval(body) {
  return axios.post(
    `${USERS_URL}/resignation_workflow/read-all-resignation-approval-workflow`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/resignation_workflow/read-resignation-approval-workflow/${id}`);
}

export function handleResignationRequest(body) {
  return axios.post(
    `${USERS_URL}/resignation_workflow/handle-resignation-application`,
    body
  );
}
