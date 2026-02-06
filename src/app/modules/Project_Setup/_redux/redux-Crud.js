import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL;

// Create Project
export function createProject(body) {
  return axios.post(`${API_URL}/project_setup/create-project-setup`, body);
}

// Get All Projects
export function getAllProjects(body) {
  const config = {
    responseType: (body.pdf || body.excel || body.csv) ? "arraybuffer" : "json",
  };

  return axios.post(
    `${API_URL}/project_setup/read-all-project-setup`,
    body,
    config
  );
}

// Get Project by ID
export function getProjectById(body) {
  return axios.post(`${API_URL}/project_setup/read-project-setup`, body);
}

// Update Project
export function updateProject(body) {
  return axios.put(`${API_URL}/project_setup/update-project-setup`, body);
}

// Delete Project
export function deleteProject(body) {
  return axios.patch(`${API_URL}/project_setup/delete-project-setup`, body);
}