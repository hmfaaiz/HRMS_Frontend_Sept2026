import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;



export async function getAllAttendanceApproval(body) {
  return axios.post(
    `${USERS_URL}/attendance_workflow/read-all-attendance-approval-workflow`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/attendance_workflow/read-attendance-approval-workflow/${id}`);
}

export function handleAttendanceRequest(body) {
  return axios.post(
    `${USERS_URL}/attendance_workflow/handle-attendance-application`,
    body
  );
}
