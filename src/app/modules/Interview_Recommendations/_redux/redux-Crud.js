// // import axios from "axios";

// // export const USERS_URL = process.env.REACT_APP_API_URL;

// // // GET: Paginated list of interviews assigned to this interviewer (employee portal)
// // export function getInterviewerAssignedInterviews(body) {
// //   return axios.post(
// //     `${USERS_URL}/interview_recommendations/read-interviewer-assigned-interviews`,
// //     body
// //   );
// // }

// // // POST: Full interview + applicant detail for recommendation modal
// // export function getInterviewRecommendationById(body) {
// //   return axios.post(
// //     `${USERS_URL}/interview_recommendations/read-interview-recommendation-by-id`,
// //     body
// //   );
// // }

// // // GET: Dropdown options for Recommended Applicant Status
// // export function getRecommendationStatusOptions() {
// //   return axios.get(
// //     `${USERS_URL}/interview_recommendations/read-recommendation-status-options`
// //   );
// // }

// // // POST: Submit recommendation (interview_remarks, interview_recommendation, recommendedApplicantStatusId)
// // export function submitInterviewRecommendation(body) {
// //   return axios.post(
// //     `${USERS_URL}/interview_recommendations/submit-interview-recommendation`,
// //     body
// //   );
// // }


// import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL;

// // GET paginated list of interviews assigned to this interviewer
// export function getInterviewerAssignedInterviews(queryParams) {
//   return axios.post(`${BASE_URL}/interview_recommendations/get-assigned-interviews`, queryParams);
// }

// // POST single interview detail for recommendation modal
// export function getInterviewRecommendationById(body) {
//   return axios.post(`${BASE_URL}/interview_recommendations/get-recommendation-by-id`, body);
// }

// // GET status dropdown options
// export function getRecommendationStatusOptions() {
//   return axios.get(`${BASE_URL}/interview_recommendations/status-options`);
// }

// // POST submit recommendation
// export function submitInterviewRecommendation(body) {
//   return axios.post(`${BASE_URL}/interview_recommendations/submit-recommendation`, body);
// }

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

// POST paginated list of interviews assigned to this interviewer
export function getInterviewerAssignedInterviews(queryParams) {
  return axios.post(
    `${BASE_URL}/interview_recommendations/read-interviewer-assigned-interviews`,
    queryParams
  );
}

// POST single interview detail for recommendation modal
export function getInterviewRecommendationById(body) {
  return axios.post(
    `${BASE_URL}/interview_recommendations/read-interview-recommendation-by-id`,
    body
  );
}

// GET status dropdown options
export function getRecommendationStatusOptions() {
  return axios.get(
    `${BASE_URL}/interview_recommendations/read-recommendation-status-options`
  );
}

// POST submit recommendation
export function submitInterviewRecommendation(body) {
  return axios.post(
    `${BASE_URL}/interview_recommendations/submit-interview-recommendation`,
    body
  );
}