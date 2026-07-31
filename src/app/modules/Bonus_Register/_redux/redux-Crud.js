import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getBonusRegisterFilters(body) {
  return axios.post(`${USERS_URL}/bonus_register/read-bonus-register-filters`, body);
}

/**Get All Bonus Register Data Paginated*/
export async function getAllBonusRegisterSetup(body) {
  return axios.post(`${USERS_URL}/bonus_register/read-all-registered-bonus`, body);
}

/**Generate Bonus Register PDF*/
export async function generatePdf(body) {
  return axios.post(`${USERS_URL}/bonus_register/read-all-registered-bonus-pdf`, body, {
    responseType: 'arraybuffer'
  });
}

/**Generate Bonus Register Excel*/
export async function generateExcel(body) {
  return axios.post(`${USERS_URL}/bonus_register/read-all-registered-bonus-excel`, body, {
    responseType: 'arraybuffer'
  });
}

/**
 * Preview Bonus Register
 */
export async function previewRegisterPdf(body) {
  return axios.post(`${USERS_URL}/bonus_register/preview-registered-bonus-pdf`, body);
}