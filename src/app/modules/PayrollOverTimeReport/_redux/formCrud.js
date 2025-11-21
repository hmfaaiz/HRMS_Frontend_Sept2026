import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllEOBIContributionSummaryForPdf(body) {
  return axios.post(`${USERS_URL}/overtime_report/read-all-overtime-report`, body,{
    responseType:'arraybuffer'
  });
}


export async function getAllIncomeTaxReportByMonthForPdf(body) {
  return axios.post(`${USERS_URL}/income_tax_report/read-all-income-tax-report-by-month`, body,{
    responseType:'arraybuffer'
  });
}
