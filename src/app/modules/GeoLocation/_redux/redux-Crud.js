import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Read
export function getAllGeoLocation(body) {
  return axios.post(
    `${USERS_URL}/geo_location/read-all-geo-location`,
    body
  );
}

export function getGeoLocationById(id) {
  return axios.get(`${USERS_URL}/geo_location/read-geo-location/${id}`);
}


//Update
export function updateGeoLocation(body) {
  return axios.put(
    `${USERS_URL}/geo_location/update-geo-location`,
    body
  );
}

//Delete
export function deleteGeoLocation(Id) {
  return axios.delete(
    `${USERS_URL}/geo_location/delete-geo-location/${Id}`
  );
}


