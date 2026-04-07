import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create ProjectSprint
export function createProjectSprint(body) {
  return axios.post(`${API_URL}/project_sprint/create-project-sprint`, body);
}

// Get All Projects
export function getAllProjectSprints(body) {
  const config = {
    responseType: (body.pdf || body.excel || body.csv) ? "arraybuffer" : "json",
  };

  return axios.post(
    `${API_URL}/project_sprint/read-all-project-sprint`,
    body,
    config
  );
}

// Get ProjectSprint by ID
export function getProjectSprintById(body) {
  return axios.post(`${API_URL}/project_sprint/read-project-sprint`, body);
}

// Update ProjectSprint
export function updateProjectSprint(body) {
  return axios.put(`${API_URL}/project_sprint/update-project-sprint`, body);
}

// Delete ProjectSprint
export function deleteProjectSprint(body) {
  return axios.patch(`${API_URL}/project_sprint/delete-project-sprint`, body);
}

export function getAllLinkedTickets(body) {
  return axios.post(`${API_URL}/project_sprint/read-linked-tickets`, body);
}


export function getSprintTickets(body) {
  return axios.post(`${API_URL}/project_sprint/read-sprint-tickets`, body);
}

export function excuteSprint(body) {
  return axios.post(`${API_URL}/project_sprint/change-sprint-status`, body);
}