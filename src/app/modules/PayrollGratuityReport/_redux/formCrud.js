import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllGratuityReportForPdf(body) {
  return axios.post(`${USERS_URL}/gratuity_report/read-all-gratuity-report`, body,{
    responseType:'arraybuffer'
  });
}


export async function getAllGratuityDetailReportForPdf(body) {
  return axios.post(`${USERS_URL}/gratuity_report/read-all-gratuity-detail-report`, body,{
    responseType:'arraybuffer'
  });
}

export async function getAllGratuityAccrualPdf(body) {
  return axios.post(`${USERS_URL}/gratuity_report/read-all-gratuity-accrual-report`, body,{
    responseType:'arraybuffer'
  });
}
