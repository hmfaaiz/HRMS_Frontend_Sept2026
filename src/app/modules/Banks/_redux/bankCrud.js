import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createBank(body) {
 
  return axios.post(`${USERS_URL}/bank/create-bank`, body);
}
// Read
export function getAllBanks(body) {
  const config = {
    responseType: (body.pdf || body.excel  || body.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/bank/read-all-banks`, body, config);
}


export function getBankById(id) {
 
  return axios.post(`${USERS_URL}/bank/read-bank`, id);
}

//Update
export function updateBank(bank) {
 
  return axios.put(`${USERS_URL}/bank/update-bank`, bank);
}

//Delete
export function deleteBank(body) {
 
 
  return axios.patch(`${USERS_URL}/bank/delete-bank`, body);
}





