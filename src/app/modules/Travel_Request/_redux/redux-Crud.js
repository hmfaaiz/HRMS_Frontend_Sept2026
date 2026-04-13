import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_URL;

// Create
export function createTravelRequest(body) {
  return axios.post(
    `${BASE_URL}/travel_request/create-travel-request`,
    body,
  );
}

// Read All
export function getAllTravelRequest(body) {
  return axios.post(
    `${BASE_URL}/travel_request/read-all-travel-request`,
    body,
  );
}


// Fetch TADA configurations by employeeId
export function getTadaConfigurationPolicies(employeeId) {
  return axios.post(`${BASE_URL}/tada_configuration_policies_portal/read-tada-configuration-policies-portal`, {
    employeeId,
  });
}

export function getEmployeeAuthorties(empId, workflowTypeId) {
  return axios.get(
    `${BASE_URL}/workflow_policy/get-employee-authorties/${empId}/${workflowTypeId}`,
  );
}

