import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllDesigMapping(body) {
  return axios.post(
    `${USERS_URL}/designation_mapping/read-all-designation-mapping`,
    body
  );
}

export function getDesigMappingById(id) {
  return axios.get(`${USERS_URL}/designation_mapping/read-designation-mapping/${id}`);
}

export function getDesigByGradeId(id) {
  return axios.get(`${USERS_URL}/designation_mapping/get-designation-by-gradeId/${id}`);
}

//Update
export function updateDesigMapping(body) {
  return axios.put(
    `${USERS_URL}/designation_mapping/update-designation-mapping`,
    body
  );
}

//Delete
export function deleteDesigMapping(Id) {
  return axios.delete(
    `${USERS_URL}/designation_mapping/delete-designation-mapping/${Id}`
  );
}


