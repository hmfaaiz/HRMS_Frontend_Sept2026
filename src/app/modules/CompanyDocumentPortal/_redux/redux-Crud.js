import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




// Read
export function getAllCompanyDoc(body) {

  return axios.post(`${USERS_URL}/company_doc_portal/read-all-company-doc-portal`, body);
}


export function getAllEmployeeDoc(body) {

  return axios.post(`${USERS_URL}/company_doc_portal/read-all-employee-doc-portal`, body);
}


