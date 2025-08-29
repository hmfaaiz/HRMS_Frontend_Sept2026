import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createExchangeRate(body) {

  
  // body.Name = body.txtExchangeRateName;
  // delete body.txtExchangeRateName

  return axios.post(`${USERS_URL}/exchange/create-exchange-rate`, body);
}


// Read
// export function getAllExchangeRate(body) {

//   return axios.post(`${USERS_URL}/exchange/read-all-exchange-rate`, body);
// }


export function getAllExchangeRate(body) {
  const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };

  return axios.post(`${USERS_URL}/exchange/read-all-exchange-rate`, body, config);
}

export function getExchangeRateById(id) {

  return axios.post(`${USERS_URL}/exchange/read-exchange-rate`, id);
}

//Update
export function updateExchangeRate(ExchangeRate) {

  return axios.put(`${USERS_URL}/exchange/update-exchange-rate`, ExchangeRate);
}

//Delete
export function deleteExchangeRate(body) {


  return axios.patch(`${USERS_URL}/exchange/delete-exchange-rate`, body);
}

//get All Roles
export function getAllRoles() {
  return axios.get(`${USERS_URL}/settings/read-all-roles-master-data`);
}

//get All Centers



export function getAllUserStatusTypes(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}


export function getLastExchangeRateBySubsidiary(data) {


  return axios.post(`${USERS_URL}/exchange/read-last-exchange-rate`, data);
}