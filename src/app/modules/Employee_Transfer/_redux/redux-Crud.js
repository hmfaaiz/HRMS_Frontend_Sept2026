import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployeeTransfer(body) {

  return axios.post(`${USERS_URL}/employee_transfer/create-employee-transfer`, body);
  
}

export function getDataFromEmployeeProfileById(body) {
  return axios.post(`${USERS_URL}/employee_transfer/get-data-from-employee-profile-by-id`, body);
}


// Read
export function getAllEmployeeTransfer(body) {


  const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };
 return axios.post(`${USERS_URL}/employee_transfer/read-all-employee-transfer`, body, config);
}

export function getEmployeeTransferById(id) {

  return axios.post(`${USERS_URL}/employee_transfer/read-employee-transfer-by-id`, { Id: id });
}

//Update
export function updateEmployeeTransfer(body) {
   
  return axios.put(`${USERS_URL}/employee_transfer/update-employee-transfer`, body);
}

//Delete
export function deleteEmployeeTransfer(body) {

  return axios.patch(`${USERS_URL}/employee_transfer/delete-employee-transfer`, body);
}

export function generateEmployeeTransferReportRequest(EmployeeTransferId) {
  return axios.post(
    `${USERS_URL}/employee_transfer/generate-employee-transfer-report`,
    { Id: EmployeeTransferId },
    { responseType: "arraybuffer" }
  );
}

