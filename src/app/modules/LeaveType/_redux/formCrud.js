import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Leave Type
 * 
 * @param {Object} body 
 * @returns res
 */
export function createLeaveTypeSetup(body) {
  return axios.post(`${USERS_URL}/leave_type/create-leave-type`, body);
}

/**
 * 
 * Get All Leave Type Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllLeaveTypeSetup(body) {
  return axios.post(`${USERS_URL}/leave_type/read-all-leave-type`, body);
}

/**
 * 
 * Get Leave Type Dropdown Data
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getTypeDropdownData(id) {
  return axios.get(`${USERS_URL}/leave_type/read-leave-type-dropdown`);
}

/**
 * 
 * Get Single Leave Type By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getLeaveTypeSetupById(id) {
  return axios.get(`${USERS_URL}/leave_type/read-leave-type/${id}`);
}

/**
 *
 * Update Single Leave Type By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateLeaveTypeSetup(body) {
  return axios.put(`${USERS_URL}/leave_type/update-leave-type`, body);
}

/**
 *
 * Delete Single Leave Type By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteLeaveTypeSetup(id) {
  return axios.delete(`${USERS_URL}/leave_type/delete-leave-type/${id}`);
}
