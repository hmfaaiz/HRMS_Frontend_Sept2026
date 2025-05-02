import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getReimbursementReport(body) {
  return axios.post(`${USERS_URL}/reimbursement_register/read-reimbursement-report`, body,{
    responseType:'arraybuffer'
  });
}


