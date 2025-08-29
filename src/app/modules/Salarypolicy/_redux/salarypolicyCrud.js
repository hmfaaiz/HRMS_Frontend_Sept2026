import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createSalarypolicy(body) {

  
  // body.Name = body.txtsalarypolicyName;
  // delete body.txtsalarypolicyName

  return axios.post(`${USERS_URL}/salary_policy/create-salarypolicy`, body);
  
}


// Read
export function getAllSalarypolicy(body) {

  return axios.post(`${USERS_URL}/salary_policy/read-all-salarypolicy`, body);
}

export function getSalarypolicyById(id) {

  return axios.post(`${USERS_URL}/salary_policy/read-salarypolicy`, id);
}

//Update
export function updateSalarypolicy(salarypolicy) {
   
  return axios.put(`${USERS_URL}/salary_policy/update-salarypolicy`, salarypolicy);
}

//Delete
export function deleteSalarypolicy(body) {

  return axios.patch(`${USERS_URL}/salary_policy/delete-salarypolicy`, body);
}
 

//Read current month 
export function getCurrentMonth() {

  return axios.get(`${USERS_URL}/salary_policy/read-currentmonth`);
}
