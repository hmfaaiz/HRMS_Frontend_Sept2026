import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmailConfig(body) {
  return axios.post(
    `${USERS_URL}/email_configuration/create-email-config`,
    body
  );
}

// Read
export function getAllEmailConfigs(body) {
  return axios.post(
    `${USERS_URL}/email_configuration/read-all-email-config`,
    body
  );
}

export function getEmailConfigById(id) {
  return axios.get(`${USERS_URL}/email_configuration/read-email-config/${id}`);
}

//Update
export function updateEmailConfig(body) {
  return axios.put(
    `${USERS_URL}/email_configuration/update-email-config`,
    body
  );
}

//Delete
export function deleteEmailConfig(Id) {
  return axios.delete(
    `${USERS_URL}/email_configuration/delete-email-config/${Id}`
  );
}

export function verifyEmailConfig(Id) {
  return axios.get(
    `${USERS_URL}/email_configuration/verify-email-config/${Id}`
  );
}
