import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


export async function getAllEOBIContributionSummaryForPdf(body) {
  return axios.post(`${USERS_URL}/contribution_report/read-all-eobi-contribution-summary-pdf-data`, body,{
    responseType:'arraybuffer'
  });
}

export async function getAllSocialSecurityContributionSummaryForPdf(body) {
  return axios.post(`${USERS_URL}/contribution_report/read-all-social-security-contribution-summary-pdf-data`, body,{
    responseType:'arraybuffer'
  });
}