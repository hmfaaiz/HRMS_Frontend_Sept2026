import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

const requestType = {
  WP: "workflow-policy",
  DWP: "designation-workflow-policy",
};

export function createRecord(body, type) {
  return axios.post(
    `${USERS_URL}/workflow_policy/create-${requestType[type]}`,
    body
  );
}

export async function getAllRecords(body, type) {
  return axios.post(
    `${USERS_URL}/workflow_policy/read-all-${requestType[type]}`,
    body
  );
}

export function getRecordById(id, type) {
  return axios.get(
    `${USERS_URL}/workflow_policy/read-${requestType[type]}/${id}`
  );
}

export function updateRecord(body, type) {
  return axios.put(
    `${USERS_URL}/workflow_policy/update-${requestType[type]}`,
    body
  );
}

export function deleteRecord(id, type) {
  return axios.delete(
    `${USERS_URL}/workflow_policy/delete-${requestType[type]}/${id}`
  );
}

export function createMultipleRecord(body, type) {
  return axios.post(
    `${USERS_URL}/workflow_policy/create-multiple-${requestType[type]}`,
    body
  );
}

export function getDesignationList(workflowTypeId) {
  return axios.get(
    `${USERS_URL}/workflow_policy/read-designation/${workflowTypeId}`
  );
}

export function getWorkflowTypeList(id) {
  return axios.post(`${USERS_URL}/workflow_policy/get-workflowType`, { id });
}

//get All Roles
export function getAllRoles() {
  return axios.get(`${USERS_URL}/settings/read-all-roles-master-data`);
}
