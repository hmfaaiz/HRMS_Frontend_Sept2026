import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function createCompany(body) {
  return axios.post(`${USERS_URL}/company/create-company`, body);
}

export async function getAllCompany(body) {
  return axios.post(`${USERS_URL}/company/read-all-company`, body);
}

export function getCompanyById(id) {
  return axios.get(`${USERS_URL}/company/read-company/${id}`,);
}

export function updateCompany(body) {
  return axios.put(`${USERS_URL}/company/update-company`, body);
}

export function deleteCompany(id) {
  return axios.delete(`${USERS_URL}/company/delete-company/${id}`);
}

export function uploadFormDoc(body) {
  return axios.post(`${USERS_URL}/company/image-upload`, body);
}