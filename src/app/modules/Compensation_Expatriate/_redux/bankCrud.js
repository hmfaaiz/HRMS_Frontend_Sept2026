import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createCompensation_Expatriate(body) {
  console.log("create earning step 1", body)
  
  // body.Name = body.txtEarningName;
  // delete body.txtEarningName

  return axios.post(`${USERS_URL}/compensation_expatriate/create-compensation-expatriate`, body);
}


// Read
export function getAllCompensation_Expatriate(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/compensation_expatriate/read-all-compensation-expatriate`, body);
}



export function getCompensation_ExpatriateById(id) {
   console.log(" earning id", id)
  return axios.post(`${USERS_URL}/compensation_expatriate/read-compensation-expatriate`, id);
}

//Update
export function updateCompensation_Expatriate(earning) {
   console.log("earning 12", earning)
  return axios.put(`${USERS_URL}/compensation_expatriate/update-compensation-expatriate`, earning);
}

//Delete
export function deleteCompensation_Expatriate(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/compensation_expatriate/delete-compensation-expatriate`, body);
}


