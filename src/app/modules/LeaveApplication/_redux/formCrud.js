import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Get Last Payroll Month
 *
 * @param {Object} body
 * @returns res
 */
export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

/**
 * Upload File or Image
 *
 * @param {Object} body
 * @returns res
 */
export function uploadImage(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

/**
 * Create Leave Application
 *
 * @param {Object} body
 * @returns res
 */
export function createLeaveApplicationSetup(body) {
  return axios.post(
    `${USERS_URL}/leave_application/create-leave-application`,
    body
  );
}

export function getLeaveApplicationDetail(body) {
  return axios.post(
    `${USERS_URL}/leave_application/get-leave-application-detail`,
    body
  );
}

/**
 *
 * Get All Leave Application Data Paginated
 *
 * @param {Object} body
 * @returns res
 */
export async function getAllLeaveApplicationSetup(body) {
  return axios.post(
    `${USERS_URL}/leave_application/read-all-leave-application`,
    body
  );
}

/**
 *
 * Get All Leave Balances according to employee Id
 *
 * @param {Object} body
 * @returns res
 */
export async function getAllLeaveBalances(body) {
  return axios.post(
    `${USERS_URL}/leave_request/read-all-employee-leave-balance-with-unpaid`,
    body
  );
}

/**
 *
 * Get Single Leave Application By Id
 *
 * @param {String|Number} id
 * @returns
 */
export function getLeaveApplicationSetupById(id) {
  return axios.get(
    `${USERS_URL}/leave_application/read-leave-application/${id}`
  );
}

/**
 *
 * Update Single Leave Application By Id
 *
 * @param {Object} body
 * @returns
 */
export function updateLeaveApplicationSetup(body) {
  return axios.put(
    `${USERS_URL}/leave_application/update-leave-application`,
    body
  );
}

/**
 *
 * Delete Single Leave Application By Id
 *
 * @param {Object} body
 * @returns
 */
export function deleteLeaveApplicationSetup(id) {
  return axios.delete(
    `${USERS_URL}/leave_application/delete-leave-application/${id}`
  );
}

export function getleaveDetail(id) {
  return axios.get(`${USERS_URL}/leave_application/get-leave-detail/${id}`);
}

export function updateleaveDetail(body) {
  return axios.post(`${USERS_URL}/leave_application/update-leave-detail`, body);
}

export function getSandwichPolicy(subsidiaryId) {
  return axios.get(
    `${USERS_URL}/leave_application/read-sandwich-policy/${subsidiaryId}`
  );
}



export function uploadFormDoc(body) {
  return axios.post(`${USERS_URL}/leave_application/document-upload`, body);
}

