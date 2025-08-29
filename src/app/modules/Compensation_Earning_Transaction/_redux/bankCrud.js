import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createEarningDeductionTran(body) {
  console.log("create earning step 1", body)
  
  // body.Name = body.txtEarningName;
  // delete body.txtEarningName

  return axios.post(`${USERS_URL}/earning_transaction/create-earning-transaction`, body);
}


// Read
export function getAllEarningDeductionTran(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/earning_transaction/read-all-earning-transaction`, body);
}



export function getEarningDeductionTranById(id) {
   console.log(" earning id", id)
  return axios.post(`${USERS_URL}/earning_transaction/read-earning-transaction`, id);
}

//Update
export function updateEarningDeductionTran(earning) {
   console.log("earning 12", earning)
  return axios.put(`${USERS_URL}/earning_transaction/update-earning-transaction`, earning);
}

//Delete
export function deleteEarningDeductionTran(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/earning_transaction/delete-earning-transaction`, body);
}


