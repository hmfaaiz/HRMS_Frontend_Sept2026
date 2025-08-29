import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Employee Shift
 * 
 * @param {Object} body 
 * @returns res
 */
export function createEmployeeShiftSetup(body) {
  return axios.post(`${USERS_URL}/employee_shift/create-employee-shift`, body);
}

/**
 * 
 * Get All Employee shift Configuration Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllEmployeeShiftSetup(body) {

  return axios.post(`${USERS_URL}/employee_shift/read-all-employee-shift`, body);
}



/**
 * 
 * Get Single Employee Shift Configuration By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getEmployeeShiftSetupById(id) {
  return axios.get(`${USERS_URL}/employee_shift/read-employee-shift/${id}`);
}

/**
 *
 * Update Single Employee Shift Configuration By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateEmployeeShiftSetup(body) {
  return axios.put(`${USERS_URL}/employee_shift/update-employee-shift`, body);
}

/**
 *
 * Delete Single Employee Shift Configuration By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteEmployeeShiftSetup(id) {
  return axios.delete(`${USERS_URL}/employee_shift/delete-employee-shift/${id}`);
}
