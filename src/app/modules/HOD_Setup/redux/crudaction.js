import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function createHOD(body) {
  return axios.post(`${USERS_URL}/hod_setup/create-hod-setup`, body);
}

export async function getAllHOD(body) {
  return axios.post(`${USERS_URL}/hod_setup/read-all-hod-setup`, body);
}

export function getHODById(id) {
  return axios.get(`${USERS_URL}/hod_setup/read-hod-setup/${id}`);
}

export function updateHOD(body) {
  return axios.put(`${USERS_URL}/hod_setup/update-hod-setup`, body);
}

export function deleteHOD(id) {
  return axios.delete(`${USERS_URL}/hod_setup/delete-hod-setup/${id}`);
}

export async function getAllEmployeeByDepartmentId(deptId) {
  return axios.get(
    `${USERS_URL}/hod_setup/read-employess-by-department/${deptId}`
  );
}

export async function getDepartmentList() {
  return axios.get(
    `${USERS_URL}/hod_setup/read-department-list`
  );
}
