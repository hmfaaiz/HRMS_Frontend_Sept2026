import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Attendance
 * 
 * @param {Object} body 
 * @returns res
 */
export function createAttendanceSetup(body) {
  return axios.post(`${USERS_URL}/attendance/create-attendance`, body);
}

/**
 * 
 * Get All Attendance Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllAttendanceSetup(body) {
  // return axios.post(`${USERS_URL}/attendance/read-all-attendance`, body);
    const config = {
    responseType: (body.pdf2 || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/attendance_summary/read-all-attendance-summary`, body, config);
}

/**
 * 
 * Get Single Attendance By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getAttendanceSetupById(id) {
  return axios.get(`${USERS_URL}/attendance/read-attendance/${id}`);
}

/**
 * 
 * Get Single Attendance By Filters
 * 
 * @param {Obejct} filters 
 * @returns 
 */
export function getAttendanceSetupByFilters(filters) {
  return axios.post(`${USERS_URL}/attendance/read-attendance-data`, filters);
}

/**
 *
 * Update Single Attendance By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateAttendanceSetup(body) {
  return axios.put(`${USERS_URL}/attendance/update-attendance`, body);
}

/**
 *
 * Process Attendance
 *  
 * @param {Object} body 
 * @returns 
 */
export function processAttendance(body) {
  return axios.post(`${USERS_URL}/attendance/process-all-attendance`, body);
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

export function getAttendanceSheetConsolidated(body) {

  const config = {
    responseType:  'arraybuffer', 
  };

  return axios.post(`${USERS_URL}/attendance/read-attendance-sheet-consolidated`, body,config);
}

