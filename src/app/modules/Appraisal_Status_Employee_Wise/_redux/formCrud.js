import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function getAppraisalStatus(body) {
  return axios.post(`${USERS_URL}/appraisal_status/read-all-appraisal-status`, body);
}


