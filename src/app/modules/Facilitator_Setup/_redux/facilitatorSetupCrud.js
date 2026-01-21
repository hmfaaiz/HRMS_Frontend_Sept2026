import axios from "axios";

export const FACILITATOR_SETUP_URL = process.env.REACT_APP_API_URL;

//Create 
export function createFacilitatorSetup(body) {
  return axios.post(`${FACILITATOR_SETUP_URL}/facilitator_setup/create-facilitator-setup`, body);
}

//Read All
export function getAllFacilitatorSetup(body) {
  return axios.post(`${FACILITATOR_SETUP_URL}/facilitator_setup/read-all-facilitator-setup`, body);
}

// READ BY ID (VIEW / EDIT)
export function getFacilitatorSetupById(id) {
  return axios.get(`${FACILITATOR_SETUP_URL}/facilitator_setup/facilitator-setup/${id}`);
}



//UPDATE
export function updateFacilitatorSetup(body) {
  return axios.put(`${FACILITATOR_SETUP_URL}/facilitator_setup/update-facilitator-setup`, body);
}

//DELETE
export function deleteFacilitatorSetup(body) {
  return axios.patch(`${FACILITATOR_SETUP_URL}/facilitator_setup/delete-facilitator-setup`, body);
}
