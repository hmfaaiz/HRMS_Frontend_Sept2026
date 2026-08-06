import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body,
  );
}

export async function getAllTravelWorkflowStatus(body) {
  return axios.post(
    `${USERS_URL}/travel_request_workflow_status/read-all-travel-request-workflow-status`,
    body,
  );
}

export async function getAllWorkflowStatusById(id) {
  return axios.get(
    `${USERS_URL}/travel_request_workflow_status/read-travel-request-workflow-status/${id}`,
  );
}

export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`,
  );
}

export function getTadaConfigurationPolicies(employeeId) {
  return axios.post(
    `${USERS_URL}/preapproval_travel_request/read-tada-configuration-policies`,
    {
      employeeId,
    },
  );
}
