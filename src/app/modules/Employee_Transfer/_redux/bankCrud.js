import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEmployeeTransfer(body) {
  console.log("create EmployeeTransfer step 1", body)
  
  // body.Name = body.txtEmployeeTransferName;
  // delete body.txtEmployeeTransferName

  return axios.post(`${USERS_URL}/employee_transfer/create-employee-transfer`, body);
}

export function createEmployeeTransferBulk(list) {
  console.log("create EmployeeTransfer bulk", list)
  
  // body.Name = body.txtEmployeeTransferName;
  // delete body.txtEmployeeTransferName

  return axios.post(`${USERS_URL}/employee_transfer/create-employee-transfer-bulk`, { data: { list } });
}


// Read
export function getAllEmployeeTransfer(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/employee_transfer/read-all-employee-transfer`, body);
}



export function getEmployeeTransferById(id) {
   console.log(" EmployeeTransfer id", id)
  return axios.post(`${USERS_URL}/employee_transfer/read-employee-transfer`, id);
}

//Update
export function updateEmployeeTransfer(EmployeeTransfer) {
   console.log("EmployeeTransfer 12", EmployeeTransfer)
  return axios.put(`${USERS_URL}/employee_transfer/update-employee-transfer`, EmployeeTransfer);
}

//Delete
export function deleteEmployeeTransfer(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/employee_transfer/delete-employee-transfer`, body);
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


