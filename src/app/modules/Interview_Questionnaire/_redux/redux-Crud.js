import axios from "axios";

export const USERS_URL = process.env.REACT_APP_API_URL;

//Create user
export function createInterviewQuestionnaire(body) {

  return axios.post(`${USERS_URL}/interview_questionnaire/create-interview-questionnaire`, body);
  
}


// Read
export function getAllInterviewQuestionnaire(body) {

  return axios.post(`${USERS_URL}/interview_questionnaire/read-all-interview-questionnaire`, body);
}

export function getInterviewQuestionnaireById(Id) {

  return axios.get(`${USERS_URL}/interview_questionnaire/read-interview-questionnaire/${Id}`);
}

//Update
export function updateInterviewQuestionnaire(body) {
   
  return axios.put(`${USERS_URL}/interview_questionnaire/update-interview-questionnaire`, body);
}

//Delete
export function deleteInterviewQuestionnaire(Id) {

  return axios.delete(`${USERS_URL}/interview_questionnaire/delete-interview-questionnaire/${Id}`);
}


// import axios from "axios";

// export const USERS_URL = process.env.REACT_APP_API_URL;

// export function createInterviewQuestionnaire(body) {
//   return axios.post(`${USERS_URL}/interview_questionnaire/create-interview-questionnaire`, body);
// }

// export function getAllInterviewQuestionnaire(body) {
//   return axios.post(`${USERS_URL}/interview_questionnaire/read-all-interview-questionnaire`, body);
// }

// export function getInterviewQuestionnaireById(Id) {
//   return axios.get(`${USERS_URL}/interview_questionnaire/read-interview-questionnaire/${Id}`);
// }

// export function updateInterviewQuestionnaire(body) {
//   return axios.put(`${USERS_URL}/interview_questionnaire/update-interview-questionnaire`, body);
// }

// export function deleteInterviewQuestionnaire(Id) {
//   return axios.delete(`${USERS_URL}/interview_questionnaire/delete-interview-questionnaire/${Id}`);
// }