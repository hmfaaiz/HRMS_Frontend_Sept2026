import axios from "axios";

export const LOGIN_URL = `${process.env.REACT_APP_API_URL}/auth/login`;
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = `${process.env.REACT_APP_API_URL}/auth/forget-password`;
export const UPDATE_PASSWORD = `${process.env.REACT_APP_API_URL}/auth/update-forget-password`;
// export const ME_URL = `${process.env.REACT_APP_API_URL}/auth/refresh-tokens`

export function login(email, password, otp) {
  return axios.post(LOGIN_URL, { email, password , otp });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function updatePassword(body) {
  return axios.post(UPDATE_PASSWORD, body);
}

// export function getUserByToken() {
//   // Authorization head should be fulfilled in interceptor.

//   return axios.get(ME_URL)

//   // return axios.get(ME_URL, {
//   //   headers: {
//   //     Authorization:
//   //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY1ODMwMTMxNiwiZXhwIjoxNjU4NDgxMzE2LCJ0eXBlIjoiYWNjZXNzIn0.PFTtXMb4s-0Mp1dkQWDvfvgiexCidruIwZfs9IQjE9s",
//   //   },
//   // })
// }
