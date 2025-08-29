import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create payroll,Policy
export function create_Payroll_Policy(body, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList) {
  return axios.post(`${USERS_URL}/payroll_process_policy/create-payroll-process-policy`, { body, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList });
}


// Read
export function getAll_Payroll_Policy(body) {
  return axios.post(`${USERS_URL}/payroll_process_policy/read-all-payroll-process-policy`, body);
}


export function get_Payroll_Policy_ById(id) {
  return axios.post(`${USERS_URL}/payroll_process_policy/read-payroll-process-policy`, id);
}

//Update
export function update_Payroll_Policy(body, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList) {
  return axios.put(`${USERS_URL}/payroll_process_policy/update-payroll-process-policy`, { body, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList });
}

//Delete
export function delete_Payroll_Policy(body) {
  return axios.patch(`${USERS_URL}/payroll_process_policy/delete-payroll-process-policy`, body);
}


