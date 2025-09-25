import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * 
 * Get All Employee Register Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllEmployeeRegisterSetup(body) {
  return axios.post(`${USERS_URL}/audit_trail/read-all-audit-trail-report`, body);
}

/**
 * 
 * Get All Employee Register Data For Pdf
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllEmployeeRegisterForPdf(body) {
  return axios.post(`${USERS_URL}/audit_trail/read-all-audit-trail-pdf-data`, body,{
    responseType:'arraybuffer'
  });
}

export async function generateExcel(body) {
  return axios.post(`${USERS_URL}/audit_trail/read-all-audit-trail-excel-data`, body,{
    responseType:'arraybuffer'
  });
}
