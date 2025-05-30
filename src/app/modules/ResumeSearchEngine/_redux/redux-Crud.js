import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;




// Read
export function getAllResumeSearchEngine(body) {

  return axios.post(`${USERS_URL}/resume_search_engine/read-all-resume-search-engine`, body);
}

// View
export function getResumeSearchEngineById(id) {

  return axios.post(`${USERS_URL}/resume_search_engine/read-resume-search-engine`, id);
}