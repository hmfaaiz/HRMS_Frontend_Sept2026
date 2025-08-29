import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createIncomeTaxSlab(body) {


  return axios.post(`${USERS_URL}/tax_slab/create-tax-slab`, body);
  
}


// Read
export function getAllIncomeTaxSlab(body) {
 
  return axios.post(`${USERS_URL}/tax_slab/read-all-tax-slab`, body);
}

export function getIncomeTaxSlabById(id) {
 
  return axios.post(`${USERS_URL}/tax_slab/read-tax-slab`, id);
}

//Update
export function updateIncomeTaxSlab(body) {
   
  return axios.put(`${USERS_URL}/tax_slab/update-tax-slab`, body);
}

//Delete
export function deleteIncomeTaxSlab(body) {

  return axios.patch(`${USERS_URL}/tax_slab/delete-tax-slab`, body);
}


export function getAllTaxYearSetup() {

  return axios.get(`${USERS_URL}/tax_slab/read-all-tax-year-setup`);
}
