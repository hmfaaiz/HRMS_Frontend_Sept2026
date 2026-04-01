import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Get Task Assignment Timeline Tickets
export function getTaskAssignmentTimeline(body) {
  const config = {
    responseType: body.pdf || body.csv || body.excel ? "arraybuffer" : "json",
  };
  return axios.post(`${API_URL}/portal_task_assignment_timeline/read-all-task-assignment-timeline`, body, config);
}


export function getAllFacilitatorTimeLogDetail(Id) {

  return axios.get(`${API_URL}/portal_task_assignment_timeline/read-all-facilitator-timelog-detail/${Id}`);
}
