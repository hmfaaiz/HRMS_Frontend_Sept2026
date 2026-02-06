import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllOvertimeReportForPdf(body) {
  return axios.post(`${USERS_URL}/ticket_time_report/read-all-project-report`, body,{
    responseType:'arraybuffer'
  });
}


export async function getAllOvertimeReportByMonthForPdf(body) {
  return axios.post(`${USERS_URL}/overtime_report/read-all-overtime-report-by-month`, body,{
    responseType:'arraybuffer'
  });
}
