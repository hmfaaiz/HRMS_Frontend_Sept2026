import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Get Task Assignment Timeline Tickets
export function getTaskAssignmentTimeline(body) {
  const config = {
    responseType: body.pdf || body.csv || body.excel ? "arraybuffer" : "json",
  };
  return axios.post(`${API_URL}/task_group_report/read-all-task-assignment-timeline`, body, config);
}


export function getAllFacilitatorTimeLogDetail(body) {

  return axios.post(`${API_URL}/task_group_report/read-all-facilitator-timelog-detail`,body);
}

export async function getAllAttendanceSetup(body) {
  console.log("CRUD FUNCTION CALLED");
  console.log("API_URL:", API_URL);
  console.log("BODY:", body);

  console.log("BEFORE AXIOS");

  const response = axios.post(
    `${API_URL}/task_group_report/read-all-attendance`,
    body
  );

  console.log("AFTER AXIOS", response);

  return response;
}