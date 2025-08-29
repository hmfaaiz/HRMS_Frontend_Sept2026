import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;



//Create record
export function createPassword(body) {
 

  return axios.post(`${USERS_URL}/password/reset-password`, body);

  
}



