import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Employee Roster
 * 
 * @param {Object} body 
 * @returns res
 */
export function createEmployeeRosterSetup(body) {
  return axios.post(`${USERS_URL}/employee_roster/create-employee-roster`, body);
}

/**
 * 
 * Get All Employee Roster Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllEmployeeRosterSetup(body) {
  return axios.post(`${USERS_URL}/employee_roster/read-all-employee-roster`, body);
}

/**
 * 
 * Get Single Employee Roster By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getEmployeeRosterSetupById(id) {
  return axios.get(`${USERS_URL}/employee_roster/read-employee-roster/${id}`);
}

/**
 *
 * Update Single Employee Roster By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateEmployeeRosterSetup(body) {
  return axios.put(`${USERS_URL}/employee_roster/update-employee-roster`, body);
}

/**
 *
 * Delete Single Employee Roster By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteEmployeeRosterSetup(id) {
  return axios.delete(`${USERS_URL}/employee_roster/delete-employee-roster/${id}`);
}


/**
 * Get Last Payroll Month
 * 
 * @param {Object} body 
 * @returns res
 */
export function getPayrollMonth(body) {
  return axios.post(`${USERS_URL}/payroll_month/get-payroll-month-previous-date`, body);
}