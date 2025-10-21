import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//read
export function fetchPayrollGroup(body) {
  return axios.post(
    `${USERS_URL}/release_payslip/read-all-finalize-payroll-group`,
    body
  );
}

//read
export function updatePayrollGroupReleasePayslip(body) {
  return axios.post(
    `${USERS_URL}/release_payslip/update-finalize-payroll-group`,
    body
  );
}
