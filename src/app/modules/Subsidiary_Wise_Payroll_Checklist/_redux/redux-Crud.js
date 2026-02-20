import axios from "axios";
export const API_URL = process.env.REACT_APP_API_URL;

export function createPayrollChecklist(body) {
  return axios.post(
    `${API_URL}/subsidiary_wise_payroll_checklist/create-subsidiary-wise-payroll-checklist`,
    body
  );
}

export function getAllPayrollChecklist(body) {
  return axios.post(
    `${API_URL}/subsidiary_wise_payroll_checklist/read-all-subsidiary-wise-payroll-checklist`,
    body
  );
}


export function getPayrollChecklist(subsidiaryId, payroll_groupId) {
  const groupId = (payroll_groupId === null || payroll_groupId === undefined) 
    ? "null" 
    : payroll_groupId;
    
  return axios.get(
    `${API_URL}/subsidiary_wise_payroll_checklist/read-subsidiary-wise-payroll-checklist/${subsidiaryId}/${groupId}`
  );
}

export function updatePayrollChecklist(body) {
  return axios.put(
    `${API_URL}/subsidiary_wise_payroll_checklist/update-subsidiary-wise-payroll-checklist`,
    body
  );
}

export function deletePayrollChecklist(body) {
  return axios.patch(
    `${API_URL}/subsidiary_wise_payroll_checklist/delete-subsidiary-wise-payroll-checklist`,body
    
  );
}

export function uploadImage(body) {
  return axios.post(`${API_URL}/file-upload`, body);
}
