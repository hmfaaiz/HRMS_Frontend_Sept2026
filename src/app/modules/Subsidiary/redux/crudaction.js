import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function createSubsidiary(body) {
  return axios.post(`${USERS_URL}/subsidiary/create-subsidiary`, body);
}

export async function getAllSubsidiary(body) {
  return axios.post(`${USERS_URL}/subsidiary/read-all-subsidiary`, body);
}

export function getSubsidiaryById(id) {
  return axios.get(`${USERS_URL}/subsidiary/read-subsidiary/${id}`,);
}

export function updateSubsidiary(body) {
  return axios.put(`${USERS_URL}/subsidiary/update-subsidiary`, body);
}

export function deleteSubsidiary(id) {
  return axios.delete(`${USERS_URL}/subsidiary/delete-subsidiary/${id}`);
}
