import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function generatePdf(body) {
  return axios.post(`${USERS_URL}/final_settlement_report/read-all-final-settlement-report`, body,{
    responseType:'arraybuffer'
  });
}



export async function generateIncomeTaxComputationPdf(body) {
  return axios.post(`${USERS_URL}/final_settlement_report/read-income-tax-computation-report`, body,{
    responseType:'arraybuffer'
  });
}


export async function generateGratuityPdf(body) {
  return axios.post(`${USERS_URL}/final_settlement_report/read-gratuity-report`, body,{
    responseType:'arraybuffer'
  });
}



export async function getProvidentFundPdf(body) {
  return axios.post(`${USERS_URL}/final_settlement_report/read-providentfund-report`, body,{
    responseType:'arraybuffer'
  });
}

