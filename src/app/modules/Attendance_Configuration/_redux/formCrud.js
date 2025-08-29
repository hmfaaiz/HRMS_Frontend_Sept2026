import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Attendance Configuration
 * 
 * @param {Object} body 
 * @returns res
 */
export function createAttendanceConfigurationSetup(body) {
  return axios.post(`${USERS_URL}/attendance_configuration/create-att-configuration`, body);
}

/**
 * 
 * Get All Attendance Configuration Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllAttendanceConfigurationSetup(body) {
  return axios.post(`${USERS_URL}/attendance_configuration/read-all-att-configuration`, body);
}



/**
 * 
 * Get Single Attendance Configuration By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getAttendanceConfigurationSetupById(id) {
  return axios.get(`${USERS_URL}/attendance_configuration/read-att-configuration/${id}`);
}

/**
 *
 * Update Single Attendance Configuration By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateAttendanceConfigurationSetup(body) {
  return axios.put(`${USERS_URL}/attendance_configuration/update-att-configuration`, body);
}

/**
 *
 * Delete Single Attendance Configuration By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteAttendanceConfigurationSetup(id) {
  return axios.delete(`${USERS_URL}/attendance_configuration/delete-att-configuration/${id}`);
}
