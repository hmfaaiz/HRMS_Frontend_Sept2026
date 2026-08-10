import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create record
export function createBonusProcess(body) {
  return axios.post(`${USERS_URL}/bonus_process/create-bonus-process`, body);
}

// Read
export function getAllBonusProcess(body) {
  return axios.post(`${USERS_URL}/bonus_process/read-all-bonus-process`, body);
}

export function getBonusProcessById(id) {
  return axios.post(`${USERS_URL}/bonus_process/read-bonus-process`, id);
}

//Update
export function updateBonusProcess(body) {
  return axios.put(`${USERS_URL}/bonus_process/update-bonus-process`, body);
}

//Delete
export function deleteBonusProcess(body) {
  return axios.patch(`${USERS_URL}/bonus_process/delete-bonus-process`, body);
}

// Powers the "View Policy" button / Bonus Policy panel
export function getBonusPolicyDetail(body) {
  return axios.post(
    `${USERS_URL}/bonus_process/read-bonus-policy-detail`,
    body,
  );
}

// Powers the Process / Cancel / Finalized buttons
export function checkBonus_EmployeesByIds(body) {
  return axios.post(`${USERS_URL}/bonus_process/check-bonus-employees`, body);
}
