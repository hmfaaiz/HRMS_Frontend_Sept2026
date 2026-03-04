import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createTaskConfig(body) {

  return axios.post(`${USERS_URL}/task_configuration/create-task-configuration`, body);
  
}


// Read
export function getAllTaskConfig(body) {

  return axios.post(`${USERS_URL}/task_configuration/read-all-task-configuration`, body);
}

export function getTaskConfigById(id) {

  return axios.get(`${USERS_URL}/task_configuration/read-task-configuration/${id}`);
}

//Update
export function updateTaskConfig(body) {
   
  return axios.put(`${USERS_URL}/task_configuration/update-task-configuration`, body);
}

//Delete
export function deleteTaskConfig(id) {

  return axios.delete(`${USERS_URL}/task_configuration/delete-task-configuration/${id}`);
}

