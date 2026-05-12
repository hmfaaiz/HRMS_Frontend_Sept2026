import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getTravelRequestReport(body) {
  return axios.post(`${USERS_URL}/travel_request_reports/read-employee-travel-history`, body,{
    responseType:'arraybuffer'
  });
}

export async function getPendingApprovalTravelRequestReport(body) {
  return axios.post(`${USERS_URL}/travel_request_reports/read-pending-approval-report`, body,{
    responseType:'arraybuffer'
  });
}


