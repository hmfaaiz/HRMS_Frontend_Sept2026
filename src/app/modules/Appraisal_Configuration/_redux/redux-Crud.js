import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAppraisalConfig(body) {
  return axios.post(
    `${USERS_URL}/appraisal_configuration/create-appraisal-configuration`,
    body
  );
}

// Read
export function getAllAppraisalConfig(body) {
  return axios.post(
    `${USERS_URL}/appraisal_configuration/read-all-appraisal-configuration`,
    body
  );
}

export function getAppraisalConfigById(id) {
  return axios.post(
    `${USERS_URL}/appraisal_configuration/read-appraisal-configuration`,
    id
  );
}

//Update
export function updateAppraisalConfig(body) {
  return axios.put(
    `${USERS_URL}/appraisal_configuration/update-appraisal-configuration`,
    body
  );
}

//Delete
export function deleteAppraisalConfig(body) {
  return axios.patch(
    `${USERS_URL}/appraisal_configuration/delete-appraisal-configuration`,
    body
  );
}
/// get designation
export function getDesignationBaseOnDepartment(body) {
  return axios.post(
    `${USERS_URL}/appraisal_configuration/get-designation`,
    body
  );
}
