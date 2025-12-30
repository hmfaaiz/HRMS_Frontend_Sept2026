import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function generateNewBankAdvice(body) {
  return axios.post(`${USERS_URL}/bank_advice/read-all-new-bank-advice-excel`, body,{
    responseType:'arraybuffer'
  });
}


export async function generateBankAdvice(body) {
  return axios.post(`${USERS_URL}/bank_advice/read-all-bank-advice-excel`, body,{
    responseType:'arraybuffer'
  });
}


export async function generateDubaiBankAdvice(body) {
  return axios.post(`${USERS_URL}/bank_advice/read-all-sif-bank-advice-csv`, body,{
    responseType:'arraybuffer'
  });
}