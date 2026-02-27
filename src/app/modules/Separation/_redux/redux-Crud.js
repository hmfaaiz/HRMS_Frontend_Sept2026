import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createSeparation(body) {

  return axios.post(`${USERS_URL}/separation/create-separation`, body);
  
}


// Read
export function getAllSeparation(body) {

const config = {
    responseType: (body?.pdf || body?.excel  || body?.csv) ? 'arraybuffer' : 'json', 
  };
 return axios.post(`${USERS_URL}/separation/read-all-separation`, body, config);
};


// employee by status
export function getsEmpBySeparationFlag(body) {

  return axios.post(`${USERS_URL}/separation/read-emp-separation-byflag`, body);
}

export function getSeparationById(id) {

  return axios.get(`${USERS_URL}/separation/read-separation/${id}`);
}

//Update
export function updateSeparation(body) {
   
  return axios.put(`${USERS_URL}/separation/update-separation`, body);
}

//Delete
export function deleteSeparation(id) {

  return axios.delete(`${USERS_URL}/separation/delete-separation/${id}`);
}

// separated
export function separateById(body) {

  return axios.put(`${USERS_URL}/separation/separated-byId/`,body);
}


export function uploadFile(body) {
  return axios.post(`${USERS_URL}/file-upload`, body);
}

//Revert
export function revertSeparation(id) {

  return axios.put(`${USERS_URL}/separation/revert-separation/${id}`);
}
