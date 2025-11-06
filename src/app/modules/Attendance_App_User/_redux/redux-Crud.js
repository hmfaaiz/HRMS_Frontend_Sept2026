import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllAttAppUser(body) {
  return axios.post(
    `${USERS_URL}/app_user/read-all-app-user`,
    body
  );
}

export function getAttAppUserById(id) {
  return axios.post(
    `${USERS_URL}/app_user/read-app-user`,
    id
  );
}

//Update
export function updateAttAppUser(body) {
  return axios.put(
    `${USERS_URL}/app_user/update-app-user`,
    body
  );
}
