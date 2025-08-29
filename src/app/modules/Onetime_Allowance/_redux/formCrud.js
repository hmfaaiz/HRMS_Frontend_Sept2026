import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function create_onetime_earning(body, earningObjList) {

  return axios.post(`${USERS_URL}/onetime_earning/create-onetime-earning`, {   ...body,earningObjList  });
  
}


// Read
export function getAll_onetime_earning(body) {
  console.log("body", body);
  return axios.post(`${USERS_URL}/onetime_earning/read-all-onetime-earning`, body);
}


export function get_onetime_earningById(id) {

  return axios.post(`${USERS_URL}/onetime_earning/read-onetime-earning`, id);
}

//Update
export function update_onetime_earning(body) {

  return axios.put(`${USERS_URL}/onetime_earning/update-onetime-earning`, body);
}

//Delete
export function delete_onetime_earning(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/onetime_earning/delete-onetime-earning`, body);
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
