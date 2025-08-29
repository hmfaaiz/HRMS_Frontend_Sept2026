import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createform(body) {

  
  // body.Name = body.txtbankName;
  // delete body.txtbankName

  return axios.post(`${USERS_URL}/form/create-form`, body);
  
}
// Read
export function getAllForm(body) {

  return axios.post(`${USERS_URL}/form/read-all-form`, body);
}



export function getFormById(id) {

  return axios.post(`${USERS_URL}/form/read-form`, id);
}

//Update
export function updateForm(form) {

  return axios.put(`${USERS_URL}/form/update-form`, form);
}

//Delete
export function deleteForm(body) {


  return axios.patch(`${USERS_URL}/form/delete-form`, body);
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
