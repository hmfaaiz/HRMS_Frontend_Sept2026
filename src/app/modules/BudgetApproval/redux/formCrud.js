import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}

export async function getAllLoanApproval(body) {
  return axios.post(
    `${USERS_URL}/department_wise_budget_approval/read-all-budget-approval`,
    body
  );
}


export async function getAllWorkflowStatusById(id) {
  return axios.get(`${USERS_URL}/department_wise_budget_approval/read-budget-approval/${id}`);
}

export function handleLoanRequest(body) {
  return axios.post(
    `${USERS_URL}/department_wise_budget_approval/handle-budget-application`,
    body
  );
}


export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`
  );
}
