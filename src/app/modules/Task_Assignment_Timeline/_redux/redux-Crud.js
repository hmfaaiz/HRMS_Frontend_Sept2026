import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Get Task Assignment Tickets
export function getTaskAssignmentTimeline(body) {
  return axios.post(`${API_URL}/task_assignment_timeline/read-all-task-assignment-timeline`, body);
}

