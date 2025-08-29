import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Leave Configurations
 * 
 * @param {Object} body 
 * @returns res
 */
export function createleaveManagementConfigurationSetup(body) {
  return axios.post(`${USERS_URL}/leave_management_configuration/create-leave-management-configuration`, body);
}

/**
 * 
 * Get All Leave Configurations Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllleaveManagementConfigurationSetup(body) {
  return axios.post(`${USERS_URL}/leave_management_configuration/read-all-leave-management-configuration`, body);
}

/**
 * 
 * Get Leave Configurations Dropdown Data
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getTypeDropdownData(id) {
  return axios.get(`${USERS_URL}/leave_management_configuration/read-leave-type-dropdown`);
}

/**
 * 
 * Get Single Leave Configurations By Id
 * 
 * @param {String|Number} id 
 * @returns 
 */
export function getleaveManagementConfigurationSetupById(payload) {
  return axios.post(`${USERS_URL}/leave_management_configuration/read-leave-management-configuration`,payload);
}

/**
 *
 * Update Single Leave Configurations By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function updateleaveManagementConfigurationSetup(body) {
  return axios.put(`${USERS_URL}/leave_management_configuration/update-leave-management-configuration`, body);
}

/**
 *
 * Delete Single Leave Configurations By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deleteleaveManagementConfigurationSetup(id) {
  return axios.delete(`${USERS_URL}/leave_management_configuration/delete-leave-management-configuration/${id}`);
}

/**
 *
 * Delete Single Leave Type Policy By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deletleaveTypePolicySetup(id) {
  return axios.delete(`${USERS_URL}/leave_management_configuration/delete-leave-type-policy/${id}`);
}

/**
 *
 * Delete Single Leave Type Salary Deduction Policy By Id
 *  
 * @param {Object} body 
 * @returns 
 */
export function deletleaveTypeDeductionPolicySetup(id) {
  return axios.delete(`${USERS_URL}/leave_management_configuration/delete-leave-type-salary-deduction-policy/${id}`);
}

/**
 * Create Allocate Leaves
 * 
 * @param {Object} body 
 * @returns res
 */
export function createAllocateLeavesSetup(body) {
  return axios.post(`${USERS_URL}/allocate_leaves/create-allocate-leaves`, body);
}