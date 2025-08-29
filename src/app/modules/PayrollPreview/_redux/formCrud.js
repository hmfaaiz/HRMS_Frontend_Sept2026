import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function previewPayslipPdf(body) {
  return axios.post(`${USERS_URL}/payroll_preview/preview-payslip-pdf`,body);
}

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

export async function generatePayslip(body) {
  return axios.post(`${USERS_URL}/payroll_preview/generate-payslip-pdf`, body,{
    responseType:'arraybuffer'
  });
}
