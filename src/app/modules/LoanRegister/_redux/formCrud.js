import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getLoanReqReport(body) {
  return axios.post(`${USERS_URL}/loan_register/read-loan-register-report`, body,{
    responseType:'arraybuffer'
  });
}


export async function getLoanPositionReport(body) {
  return axios.post(`${USERS_URL}/loan_register/read-loan-position-report`, body,{
    responseType:'arraybuffer'
  });
}


