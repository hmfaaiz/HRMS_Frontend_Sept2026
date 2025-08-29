import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createRegion(body) {
  console.log("create Region step 1", body)
  
  // body.Name = body.txtbankName;
  // delete body.txtbankName

  return axios.post(`${USERS_URL}/region/create-region`, body);
  
}
// Read
export function getAllRegion(body) {
  console.log("body",body);
  return axios.post(`${USERS_URL}/region/read-all-region`, body);
}

let authSMSSend =  async ()=> {
  let auth_url = 'https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi';
  return axios.post(auth_url);    
  
  };
  

export function getRegionById(id) {
   console.log("Region id", id)
  return axios.post(`${USERS_URL}/region/read-region`, id);
}

//Update
export function updateRegion(Region) {
   console.log("updateUser 12", Region)
  return axios.put(`${USERS_URL}/region/update-region`, Region);
}

//Delete
export function deleteRegion(body) {
  console.log("body")
  console.log(body);
  return axios.patch(`${USERS_URL}/region/delete-region`, body);
}

//get All Roles
export function getAllRoles() {
  return axios.get(`${USERS_URL}/settings/read-all-roles-master-data`);
}

//get All Centers



export function getAllUserStatusTypes(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}


export const donationReport = async (body) => {
  return await axios.post(`${USERS_URL}/edrs/donation-report`, body);
};

export function sms_athentication(body) {
  return axios.post(
    `${USERS_URL}/settings/read-all-status-types-master-data`,
    body
  );
}
