import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function getAllRoster(body) {
  return axios.post(`${USERS_URL}/portal_calendar/read-roster-calendar`, body);
}

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}