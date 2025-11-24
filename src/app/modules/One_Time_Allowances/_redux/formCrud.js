import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createOneTimeAllowance(body) {
  return axios.post(
    `${USERS_URL}/onetime_allowance/create-onetime-allowance`,
    body
  );
}

// Read
export function getAllOneTimeAllowance(body) {
  return axios.post(
    `${USERS_URL}/onetime_allowance/read-all-onetime-allowance`,
    body
  );
}

export function getOneTimeAllowanceById(Id) {
  return axios.post(
    `${USERS_URL}/onetime_allowance/read-onetime-allowance`,
    {Id : Id}
  );
}

//Update
export function updateOneTimeAllowance(body) {
  return axios.put(
    `${USERS_URL}/onetime_allowance/update-onetime-allowance`,
    body
  );
}

//Delete
export function deleteOneTimeAllowance(Id) {
  return axios.delete(
    `${USERS_URL}/onetime_allowance/delete-onetime-allowance/${Id}`
  );
}
