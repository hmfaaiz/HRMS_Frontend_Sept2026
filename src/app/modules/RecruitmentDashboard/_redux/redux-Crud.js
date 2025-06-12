import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




// Read
export function getAllRecruitment_dashboard(body) {

  return axios.post(`${USERS_URL}/recruitment_dashboard/read-all-recruitment-dashboard`, body);
}

// View
export function getResumeSearchEngineById(id) {

  return axios.post(`${USERS_URL}/recruitment_dashboard/read-resume-search-engine`, id);
}