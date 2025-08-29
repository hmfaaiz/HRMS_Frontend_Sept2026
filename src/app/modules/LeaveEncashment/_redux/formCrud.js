import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Get Last Payroll Month
 * 
 * @param {Object} body 
 * @returns res
 */
export function getPayrollMonth(body) {
  return axios.post(`${USERS_URL}/payroll_month/get-payroll-month-previous-date`, body);
}

/**
 * Create Leave Encashment
 * 
 * @param {Object} body 
 * @returns res
 */
export function createLeaveEncashmentSetup(body) {
  return axios.post(`${USERS_URL}/leave_encashment/create-leave-encashment`, body);
}

/**
 * 
 * Get All Leave Encashment Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllLeaveEncashmentSetup(body) {
  return axios.post(`${USERS_URL}/leave_encashment/read-all-leave-encashment`, body);
}

/**
 * 
 * Get All Leave Balances according to employee Id
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllLeaveBalances(body) {
  return axios.post(`${USERS_URL}/employee_leave_balance/read-all-employee-leave-balance`, body);
}

/**
 * 
 * Get Single Leave Encashment By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getLeaveEncashmentSetupById(id) {
  return axios.get(`${USERS_URL}/leave_encashment/read-leave-encashment/${id}`);
}

/**
 *
 * Update Single Leave Encashment By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateLeaveEncashmentSetup(body) {
  return axios.put(`${USERS_URL}/leave_encashment/update-leave-encashment`, body);
}

/**
 *
 * Delete Single Leave Encashment By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteLeaveEncashmentSetup(id) {
  return axios.delete(`${USERS_URL}/leave_encashment/delete-leave-encashment/${id}`);
}
