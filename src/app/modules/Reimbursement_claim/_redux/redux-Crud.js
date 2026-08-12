import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export function uploadImage(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

//Create record
export function createReimbursementClaim(body) {
 

  return axios.post(`${USERS_URL}/reimbursement_claim/create-reimbursement-claim`, body);

  
}


// Read
export function getAllReimbursementClaim(body) {


  return axios.post(`${USERS_URL}/reimbursement_claim/read-all-reimbursement-claim`, body);
}

export function getReimbursementClaimById(id) {

  return axios.post(`${USERS_URL}/reimbursement_claim/read-reimbursement-claim`, id);
}

//Update
export function updateReimbursementClaim(reimbursementClaim) {
   
  return axios.put(`${USERS_URL}/reimbursement_claim/update-reimbursement-claim`, reimbursementClaim);
}

//Delete
export function deleteReimbursementClaim(body) {

  return axios.patch(`${USERS_URL}/reimbursement_claim/delete-reimbursement-claim`, body);
}

export function getAllReimbursementConfigPolicy(body) {
 

  return axios.post(`${USERS_URL}/reimbursement_claim/read-reimbursement-configuration-policies`, body);

  
}


export function updateApprovedStatus(data) {
   
  return axios.put(`${USERS_URL}/reimbursement_claim/update-reimbursement-approved-status`, data);
}

export function uploadFormDoc(body) {
  return axios.post(`${USERS_URL}/reimbursement_claim/document-upload`, body);
}