import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createDesignation(body) {
  
  // body.Name = body.txtbankName;
  // delete body.txtbankName

  return axios.post(`${USERS_URL}/designation/create-designation`, body);
  
}
// Read
export function getAllDesignation(body) {
  return axios.post(`${USERS_URL}/designation/read-all-designation`, body);
}

let authSMSSend =  async ()=> {
  let auth_url = 'https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi';
  return axios.post(auth_url);    
  
  };
  

export function getDesignationById(id) {
  return axios.post(`${USERS_URL}/designation/read-designation`, id);
}

//Update
export function updateDesignation(religion) {
  return axios.put(`${USERS_URL}/designation/update-designation`, religion);
}

//Delete
export function deleteDesignation(body) {
  return axios.patch(`${USERS_URL}/designation/delete-designation`, body);
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
