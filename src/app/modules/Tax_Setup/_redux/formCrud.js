import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createTaxSetup(body) {
  

  return axios.post(`${USERS_URL}/tax_setup/create-tax-setup`, body);
  
}


// Read
export function getAllTaxSetup(body) {

  return axios.post(`${USERS_URL}/tax_setup/read-all-tax-setup`, body);
}

let authSMSSend =  async ()=> {
  let auth_url = 'https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi';
  return axios.post(auth_url);    
  
  };
  

export function getTaxSetupById(id) {
   
  return axios.post(`${USERS_URL}/tax_setup/read-tax-setup`, id);
}

//Update
export function updateTaxSetup(body) {
   
  return axios.put(`${USERS_URL}/tax_setup/update-tax-setup`, body);
}

//Delete
export function deleteTaxSetup(body) {


  return axios.patch(`${USERS_URL}/tax_setup/delete-tax-setup`, body);
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
