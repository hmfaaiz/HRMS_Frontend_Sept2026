import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createfinalSettlementPolicy(body, earningObjList) {

  return axios.post(`${USERS_URL}/final_settlement_policy/insert-final-settlement-policy`, { data: { earningObjList, body } });
  
}


// Read
export function getAllfinalSettlementPolicy(body) {
  console.log("body", body);
  return axios.post(`${USERS_URL}/final_settlement_policy/read-all-final-settlement-policy`, body);
}


export function getfinalSettlementPolicyById(id) {

  return axios.post(`${USERS_URL}/final_settlement_policy/read-final-settlement-policy`, id);
}

//Update
export function updatefinalSettlementPolicy(body) {

  return axios.put(`${USERS_URL}/final_settlement_policy/update-final-settlement-policy`, body);
}

//Delete
export function deletefinalSettlementPolicy(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/final_settlement_policy/delete-final-settlement-policy`, body);
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


export const donationReport = async (body) => {
  return await axios.post(`${USERS_URL}/edrs/donation-report`, body);
};

export function sms_athentication(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}
