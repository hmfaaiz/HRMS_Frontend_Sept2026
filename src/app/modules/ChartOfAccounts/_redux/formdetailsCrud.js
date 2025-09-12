import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createChartOfAccounts(body) {
  return axios.post(`${USERS_URL}/chart_account/create-chart-of-accounts`, body);
}

export function getAllChartsOfAccounts(id) {
  const config = {
    responseType: id.pdf || id.excel || id.csv ? "arraybuffer" : "json",
  };

  return axios.post(
    `${USERS_URL}/chart_account/read-all-chart-of-accounts`,
    { id },
    config
  );
}

export function getChartOfAccountsById(body) {
  return axios.post(`${USERS_URL}/chart_account/read-chart-of-accounts`, body);
}

//Update
export function updateChartOfAccountsById(form) {
  return axios.put(`${USERS_URL}/chart_account/update-chart-of-accounts`, form);
}

//Delete
export function deleteChartOfAccountsById(body) {
  return axios.patch(`${USERS_URL}/chart_account/delete-chart-of-accounts`, body);
}



