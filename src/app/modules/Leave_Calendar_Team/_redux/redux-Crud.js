import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;


// Read
export function getAllLeave(body) {

  return axios.post(`${USERS_URL}/portal_calendar/read-leave-calendar`, body);
}

export function getPayrollMonth(body) {
  return axios.post(
    `${USERS_URL}/payroll_month/get-payroll-month-previous-date`,
    body
  );
}


