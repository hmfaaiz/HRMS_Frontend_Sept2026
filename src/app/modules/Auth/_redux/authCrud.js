import axios from "axios";

export const LOGIN_URL = `${process.env.REACT_APP_API_URL}/auth/login`;
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";
// export const ME_URL = `${process.env.REACT_APP_API_URL}/auth/refresh-tokens`

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
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
