import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllDesigMapping(body) {
  return axios.post(
    `${USERS_URL}/department_designation_map/read-all-department-designation-map`,
    body
  );
}

export function getDesigMappingById(id) {
  return axios.get(`${USERS_URL}/department_designation_map/read-department-designation-map/${id}`);
}

export function getDesigByGradeId(id) {
  return axios.get(`${USERS_URL}/department_designation_map/get-designation-by-departmentId/${id}`);
}

//Update
export function updateDesigMapping(body) {
  return axios.put(
    `${USERS_URL}/department_designation_map/update-department-designation-map`,
    body
  );
}

//Delete
export function deleteDesigMapping(Id) {
  return axios.delete(
    `${USERS_URL}/department_designation_map/delete-department-designation-map/${Id}`
  );
}


