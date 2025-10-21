import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createDesignationDepMapForExitClearance(body) {

  return axios.post(`${USERS_URL}/designation_dep_map_for_exit_clearance/create-designation-dep-map-for-exit-clearance`, body);
  
}


// Read
export function getAllDesignationMapForExitClearance(body) {

  return axios.post(`${USERS_URL}/designation_dep_map_for_exit_clearance/read-all-designation-dep-map-for-exit-clearance`, body);
}

export function getDesignationMapForExitClearanceById(id) {

  return axios.get(`${USERS_URL}/designation_dep_map_for_exit_clearance/read-designation-dep-map-for-exit-clearance/${id}`);
}

//Update
export function updateDesignationDepMapForExitClearance(accrueGratuityConfig) {
   
  return axios.put(`${USERS_URL}/designation_dep_map_for_exit_clearance/update-designation-dep-map-for-exit-clearance`, accrueGratuityConfig);
}

//Delete
export function deleteDesignationDepMapForExitClearance(body) {

  return axios.patch(`${USERS_URL}/designation_dep_map_for_exit_clearance/delete-designation-dep-map-for-exit-clearance`, body);
}
