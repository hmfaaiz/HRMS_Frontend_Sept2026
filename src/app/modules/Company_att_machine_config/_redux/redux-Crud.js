import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createAttMachineConfig(body) {

  return axios.post(`${USERS_URL}/company_att_machine_config/create-att-machine-config`, body);
  
}


// Read
export function getAllAttMachineConfig(body) {

  return axios.post(`${USERS_URL}/company_att_machine_config/read-all-att-machine-config`, body);
}

export function getAttMachineConfigById(id) {

  return axios.post(`${USERS_URL}/company_att_machine_config/read-att-machine-config`, id);
}

//Update
export function updateAttMachineConfig(body) {
   
  return axios.put(`${USERS_URL}/company_att_machine_config/update-att-machine-config`, body);
}

//Delete
export function deleteAttMachineConfig(body) {

  return axios.patch(`${USERS_URL}/company_att_machine_config/delete-att-machine-config`, body);
}

