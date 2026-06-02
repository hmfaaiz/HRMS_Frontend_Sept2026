import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createClosePayrollMonthSetup(body) {
  

  return axios.post(`${USERS_URL}/close_payroll_month/create-close-payroll-month`, body);
  
}


// Read
export function getAllClosePayrollMonthSetup(body) {

  return axios.post(`${USERS_URL}/close_payroll_month/read-all-close-payroll-month`, body);
}


  

export function getClosePayrollMonthSetupById(id) {
   
  return axios.post(`${USERS_URL}/close_payroll_month/read-close-payroll-month`, id);
}

//Update
export function updateClosePayrollMonthSetup(body) {
   
  return axios.put(`${USERS_URL}/close_payroll_month/update-close-payroll-month`, body);
}

//Delete
export function deleteClosePayrollMonthSetup(body) {

 
  return axios.patch(`${USERS_URL}/close_payroll_month/delete-close-payroll-month`, body);
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
