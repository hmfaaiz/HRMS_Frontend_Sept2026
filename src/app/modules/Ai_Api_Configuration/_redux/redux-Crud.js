import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAiApiConfiguration(body) {
  return axios.post(
    `${USERS_URL}/ai_api_configuration/create-ai-api-configuration`,
    body
  );
}

// Read
export function getAllAiApiConfigurations(body) {
  return axios.post(
    `${USERS_URL}/ai_api_configuration/read-all-ai-api-configuration`,
    body
  );
}

export function getAiApiConfigurationById(id) {
  return axios.get(`${USERS_URL}/ai_api_configuration/read-ai-api-configuration/${id}`);
}

//Update
export function updateAiApiConfiguration(body) {
  return axios.put(
    `${USERS_URL}/ai_api_configuration/update-ai-api-configuration`,
    body
  );
}

//Delete
export function deleteAiApiConfiguration(Id) {
  return axios.delete(
    `${USERS_URL}/ai_api_configuration/delete-ai-api-configuration/${Id}`
  );
}

export function verifyAiApiConfiguration(Id) {
  return axios.get(
    `${USERS_URL}/ai_api_configuration/verify-ai-api-configuration/${Id}`
  );
}
