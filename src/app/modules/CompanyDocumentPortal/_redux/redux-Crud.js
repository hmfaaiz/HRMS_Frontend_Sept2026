import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




// Read
export function getAllHoliday(body) {

  return axios.post(`${USERS_URL}/company_doc_portal/read-all-company-doc-portal`, body);
}




