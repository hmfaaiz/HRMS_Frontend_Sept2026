import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * 
 * Get All Leave Register Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllLeaveRegisterSetup(body) {
  return axios.post(`${USERS_URL}/leave_register/read-all-registered-leaves`, body);
}

/**
 * 
 * Get All Leave Register Data For Pdf
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllLeaveRegisterForPdf(body) {
  return axios.post(`${USERS_URL}/leave_register/read-all-registered-leaves-pdf-data`, body,{
    responseType:'arraybuffer'
  });
}