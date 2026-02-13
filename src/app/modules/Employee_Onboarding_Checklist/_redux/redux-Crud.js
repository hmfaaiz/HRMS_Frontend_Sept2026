import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// CREATE
export function createEmployeeOnboardingChecklist(body) {
  return axios.post(
    `${USERS_URL}/employee_onboarding_checklist/create-employee-onboarding-checklist`,
    body
  );
}

// READ ALL
export function getAllEmployeeOnboardingChecklist(body) {
  return axios.post(
    `${USERS_URL}/employee_onboarding_checklist/read-all-employee-onboarding-checklist`,
    body
  );
}

// READ BY EMPLOYEE
export function getEmployeeOnboardingChecklistByEmployee(employeeId) {
  return axios.get(
    `${USERS_URL}/employee_onboarding_checklist/read-employee-onboarding-checklist/${employeeId}`
  );
}

// LOAD MASTER (from subsidiary wise checklist)
export function getMasterChecklistByEmployee(body) {
  return axios.post(
    `${USERS_URL}/employee_onboarding_checklist/load-master-checklist`,
    body
  );
}

// UPDATE
export function updateEmployeeOnboardingChecklist(body) {
  return axios.put(
    `${USERS_URL}/employee_onboarding_checklist/update-employee-onboarding-checklist`,
    body
  );
}

// DELETE
export function deleteEmployeeOnboardingChecklist(employeeId) {
  return axios.delete(
    `${USERS_URL}/employee_onboarding_checklist/delete-employee-onboarding-checklist/${employeeId}`
  );
}
