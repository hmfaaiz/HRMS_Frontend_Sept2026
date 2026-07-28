// _redux/redux-Crud.js
import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function createBonusPolicy(body) {
  return axios.post(`${USERS_URL}/bonus_policy/create-bonus-policy`, body);
}

export function getAllBonusPolicy(body) {
  return axios.post(`${USERS_URL}/bonus_policy/read-all-bonus-policy`, body);
}

export function getBonusPolicyById(id) {
  return axios.post(`${USERS_URL}/bonus_policy/read-bonus-policy`, id);
}

export function updateBonusPolicy(body) {
  return axios.put(`${USERS_URL}/bonus_policy/update-bonus-policy`, body);
}

export function deleteBonusPolicy(body) {
  return axios.patch(`${USERS_URL}/bonus_policy/delete-bonus-policy`, body);
}

export function getActiveEarningsBySubsidiary(body) {
  return axios.post(`${USERS_URL}/bonus_policy/read-active-earnings-by-subsidiary`, body);
}