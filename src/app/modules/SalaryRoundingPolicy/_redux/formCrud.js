import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Rounding Policy Policy
 * 
 * @param {Object} body 
 * @returns res
 */
export function createRoundingPolicySetup(body) {
  return axios.post(`${USERS_URL}/rounding_policy/create-rounding-policy`, body);
}

/**
 * 
 * Get All Rounding Policy Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllRoundingPolicySetup(body) {
  return axios.post(`${USERS_URL}/rounding_policy/read-all-rounding-policy`, body);
}

/**
 * 
 * Get Payment Mode Dropdown Data
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getPaymentModeData(id) {
  return axios.get(`${USERS_URL}/rounding_policy/read-payment-mode/${id}`);
}

/**
 * 
 * Get Single Rounding Policy Policy By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getRoundingPolicySetupById(id) {
  return axios.get(`${USERS_URL}/rounding_policy/read-rounding-policy/${id}`);
}

/**
 *
 * Update Single Rounding Policy Policy By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateRoundingPolicySetup(body) {
  return axios.put(`${USERS_URL}/rounding_policy/update-rounding-policy`, body);
}

/**
 *
 * Delete Single Rounding Policy Policy By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteRoundingPolicySetup(id) {
  return axios.delete(`${USERS_URL}/rounding_policy/delete-rounding-policy/${id}`);
}
