import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployeeDoc(body) {

  return axios.post(`${USERS_URL}/employee_doc/create-employee-doc`, body);
  
}


// Read
export function getAllEmployeeDoc(body) {

  return axios.post(`${USERS_URL}/employee_doc/read-all-employee-doc`, body);
}

export function getEmployeeDocById(id) {

  return axios.get(`${USERS_URL}/employee_doc/read-employee-doc/${id}`);
}

//Update
export function updateEmployeeDoc(body) {
   
  return axios.put(`${USERS_URL}/employee_doc/update-employee-doc`, body);
}

//Delete
export function deleteEmployeeDoc(Id) {

  return axios.delete(`${USERS_URL}/employee_doc/delete-employee-doc/${Id}`);
}
