import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createfiscalSetup(body) {
  

  return axios.post(`${USERS_URL}/fiscal_setup/create-fiscal-setup`, body);
  
}


// Read
export function getAllfiscalSetup(body) {

  return axios.post(`${USERS_URL}/fiscal_setup/read-all-fiscal-setup`, body);
}

let authSMSSend =  async ()=> {
  let auth_url = 'https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi';
  return axios.post(auth_url);    
  
  };
  

export function getfiscalSetupById(id) {
   
  return axios.post(`${USERS_URL}/fiscal_setup/read-fiscal-setup`, id);
}

//Update
export function updatefiscalSetup(body) {
   
  return axios.put(`${USERS_URL}/fiscal_setup/update-fiscal-setup`, body);
}

//Delete
export function deletefiscalSetup(body) {


  return axios.patch(`${USERS_URL}/fiscal_setup/delete-fiscal-setup`, body);
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
