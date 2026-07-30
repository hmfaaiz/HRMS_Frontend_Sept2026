import axios from "axios";

// TODO: Replace with /employee_profile_workflow/... routes once backend is ready
export const USERS_URL = process.env.REACT_APP_API_URL;

export function createEmployeeProfileWorkflowPortal(body) {
  return axios.post(`${USERS_URL}/employee_profile_workflow/create-employee-profile-workflow`, body);
}

export function getDataFromEmployeeProfileById(body) {
  return axios.post(`${USERS_URL}/employee_profile_workflow/get-data-from-employee-profile-by-id`, body);
}

export function getAllEmployeeProfileWorkflowPortal(body) {
  const config = {
    responseType: (body?.pdf || body?.excel || body?.csv) ? "arraybuffer" : "json",
  };
  return axios.post(`${USERS_URL}/employee_profile_workflow_hrms/read-all-employee-profile-workflow-hrms`, body, config);
}

export function getEmployeeProfileWorkflowPortalById(id) {
  return axios.post(`${USERS_URL}/employee_profile_workflow_hrms/read-employee-profile-workflow-hrms`, { Id: id });
}


export function updateEmployeeProfileWorkflowPortal(body) {
  return axios.put(`${USERS_URL}/employee_profile_workflow/update-employee-profile-workflow`, body);
}

// HRMS approval endpoint
export function updateEmployeeProfileWorkflowHrms(body) {
  return axios.post(`${USERS_URL}/employee_profile_workflow_hrms/update-employee-profile-workflow-hrms`, body);
}

export function deleteEmployeeProfileWorkflowPortal(body) {
  return axios.patch(`${USERS_URL}/employee_profile_workflow/delete-employee-profile-workflow`, body);
}

export function generateEmployeeProfileWorkflowPortalReportRequest(Id) {
  return axios.post(
    `${USERS_URL}/employee_profile_workflow/generate-employee-profile-workflow-report`,
    { Id },
    { responseType: "arraybuffer" }
  );
}

export function getDataFromEmployeeDocumnentById(body) {
  return axios.post(`${USERS_URL}/employee_profile_workflow_hrms/get-data-from-employee-document-by-id`, body);
}

export function getDataFromEmployeeDocumnentOriginalById(body) {
  return axios.post(`${USERS_URL}/employee_profile_workflow_hrms/get-data-from-employee-document-original-by-id`, body);
}
