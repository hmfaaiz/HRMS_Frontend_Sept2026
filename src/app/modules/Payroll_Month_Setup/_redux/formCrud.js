import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createPayrollMonthSetup(body) {
  

  return axios.post(`${USERS_URL}/payroll_month/create-payroll-month`, body);
  
}


// Read
export function getAllPayrollMonthSetup(body) {

  return axios.post(`${USERS_URL}/payroll_month/read-all-payroll-month`, body);
}


  

export function getPayrollMonthSetupById(id) {
   
  return axios.post(`${USERS_URL}/payroll_month/read-payroll-month`, id);
}

//Update
export function updatePayrollMonthSetup(body) {
   
  return axios.put(`${USERS_URL}/payroll_month/update-payroll-month`, body);
}

//Delete
export function deletePayrollMonthSetup(body) {

 
  return axios.patch(`${USERS_URL}/payroll_month/delete-payroll-month`, body);
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
