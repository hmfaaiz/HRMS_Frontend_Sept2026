import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

// Create
export function createLoanCashPayment(body) {
  return axios.post(`${USERS_URL}/cash_payment_against_loan/create-cash-payment-against-loan`, body);
}

// Read All
export function getAllLoanCashPayments(body) {
  return axios.post(`${USERS_URL}/cash_payment_against_loan/read-all-cash-payment-against-loan`, body);
}

// Read By Id
export function getLoanCashPaymentById(body) {
  return axios.post(`${USERS_URL}/cash_payment_against_loan/read-cash-payment-against-loan`, body);
}

// Update
export function updateLoanCashPayment(body) {
  return axios.put(`${USERS_URL}/cash_payment_against_loan/update-cash-payment-against-loan`, body);
}

// Delete
export function deleteLoanCashPayment(body) {
  return axios.patch(`${USERS_URL}/cash_payment_against_loan/delete-cash-payment-against-loan`, body);
}

// Get Loan Outstanding (called on employee + loan type select)
export function getLoanOutstandingRequest(body) {
  return axios.post(`${USERS_URL}/cash_payment_against_loan/read-loan-outstanding`, body);
}








// import axios from "axios";

// export const USERS_URL = process.env.REACT_APP_API_URL;

// // ── Create ────────────────────────────────────────────────────────────────────
// export function createLoanCashPayment(body) {
//   return axios.post(
//     `${USERS_URL}/employee_loan_cash_payment/create-cash-payment-against-loan`,
//     body
//   );
// }

// // ── Read All ──────────────────────────────────────────────────────────────────
// export function getAllLoanCashPayments(body) {
//   return axios.post(
//     `${USERS_URL}/employee_loan_cash_payment/read-all-cash-payment-against-loan`,
//     body
//   );
// }

// // ── Read By Id ────────────────────────────────────────────────────────────────
// export function getLoanCashPaymentById(body) {
//   return axios.post(
//     `${USERS_URL}/employee_loan_cash_payment/read-cash-payment-against-loan`,
//     body
//   );
// }

// // ── Update ────────────────────────────────────────────────────────────────────
// export function updateLoanCashPayment(body) {
//   return axios.put(
//     `${USERS_URL}/employee_loan_cash_payment/update-cash-payment-against-loan`,
//     body
//   );
// }

// // ── Delete ────────────────────────────────────────────────────────────────────
// export function deleteLoanCashPayment(body) {
//   return axios.patch(
//     `${USERS_URL}/employee_loan_cash_payment/delete-cash-payment-against-loan`,
//     body
//   );
// }

// // ── Loan Outstanding (helper) ─────────────────────────────────────────────────
// export function getLoanOutstandingRequest(body) {
//   return axios.post(
//     `${USERS_URL}/employee_loan_cash_payment/read-loan-outstanding`,
//     body
//   );
// }