import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getTicketReportByFilters(body) {
  return axios.post(`${USERS_URL}/ticket_time_report/read-all-project-report`, body,{
    responseType:'arraybuffer'
  });
}



export function getAllPreviewData(body) {

  return axios.post(`${USERS_URL}/ticket_time_report/read-all-preview-report`, body);
}
