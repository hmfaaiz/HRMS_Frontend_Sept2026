import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Employee Leave Balance
 * 
 * @param {Object} body 
 * @returns res
 */
export function createEmployeeLeaveBalanceSetup(body) {
  return axios.post(`${USERS_URL}/employee_leave_balance/create-employee-leave-balance`, body);
}

/**
 * 
 * Get All Employee Leave Balance Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllEmployeeLeaveBalanceSetup(body) {
  return axios.post(`${USERS_URL}/employee_leave_balance/read-all-employee-leave-balance`, body);
}

/**
 * 
 * Get Single Employee Leave Balance By Id
 * 
 * @param {Object} body 
 * @returns 
 */
export function getEmployeeLeaveBalanceSetupByFilters(body) {
  return axios.post(`${USERS_URL}/employee_leave_balance/read-employee-leave-balance`, body);
}