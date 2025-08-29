import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * Create Allocate Leaves
 * 
 * @param {Object} body 
 * @returns res
 */
export function createAllocateLeavesSetup(body) {
  return axios.post(`${USERS_URL}/allocate_leaves/create-allocate-leaves`, body);
}

/**
 * 
 * Get All Allocate Leaves Data
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllAllocateLeavesSetup(body) {
  return axios.post(`${USERS_URL}/allocate_leaves/read-all-allocate-leaves`, body);
}

/**
 * 
 * Get Dropdown Data
 * 
 * @returns 
 */
export function getPolicyDropdownData() {
  return axios.get(`${USERS_URL}/allocate_leaves/read-policy-type-dropdown`);
}