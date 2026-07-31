import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllAttendanceSetup(body) {
  // return axios.post(`${USERS_URL}/attendance/read-all-attendance`, body);
    const config = {
    responseType: (body.pdf2 || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/cpl_approval/read-all-cpl-approval`, body, config);
}


export function processAttendance(body) {
  return axios.post(`${USERS_URL}/cpl_approval/run-cpl-approval`, body);
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
