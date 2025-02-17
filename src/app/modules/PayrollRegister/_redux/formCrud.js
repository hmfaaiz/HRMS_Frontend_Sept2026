import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

/**
 * 
 * Get All Payroll Register Data Paginated
 * 
 * @param {Object} body 
 * @returns res
 */
export async function getAllPayrollRegisterSetup(body) {
  return axios.post(`${USERS_URL}/payroll_register/read-all-registered-payroll`, body);
}

/**
 * 
 * Generate Payslip PDf
 * 
 * @param {Object} body 
 * @returns res
 */
export async function generatePayslip(body) {
  return axios.post(`${USERS_URL}/payroll_register/generate-payslip-pdf`, body,{
    responseType:'arraybuffer'
  });
}

/**
 * 
 * Generate payroll register PDf
 * 
 * @param {Object} body 
 * @returns res
 */
export async function generatePdf(body) {
  return axios.post(`${USERS_URL}/payroll_register/read-all-registered-payroll-pdf`, body,{
    responseType:'arraybuffer'
  });
}

/**
 * 
 * Generate payroll register Excel
 * 
 * @param {Object} body 
 * @returns res
 */
export async function generateExcel(body) {
  return axios.post(`${USERS_URL}/payroll_register/read-all-registered-payroll-excel`, body,{
    responseType:'arraybuffer'
  });
}

/**
 * 
 * Generate payroll register Excel
 * 
 * @param {Object} body 
 * @returns res
 */
export async function generateBankAdvice(body) {
  return axios.post(`${USERS_URL}/payroll_register/read-all-bank-advice-excel`, body,{
    responseType:'arraybuffer'
  });
}

export async function generateGDExcel(body) {
  return axios.post(`${USERS_URL}/payroll_register/read-all-registered-payroll-gd-excel`, body,{
    responseType:'arraybuffer'
  });
}
