import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createContact(body) {
  
  // body.Name = body.txtContactName;
  // delete body.txtContactName

  return axios.post(`${USERS_URL}/contact/create-contact`, body);
  
}


// Read
export function getAllContacts(body) {
  return axios.post(`${USERS_URL}/contact/read-all-contact`, body);
}



export function getContactById(id) {
  return axios.post(`${USERS_URL}/contact/read-contact`, id);
}

//Update
export function updateContact(Contact) {
  return axios.put(`${USERS_URL}/contact/update-contact`, Contact);
}

//Delete
export function deleteContact(body) {
  return axios.patch(`${USERS_URL}/contact/delete-contact`, body);
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
